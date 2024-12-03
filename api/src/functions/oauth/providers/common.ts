import { randomUUID } from 'crypto'

import { Provider, User } from '@prisma/client'
import type { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda'
import { parse, serialize } from 'cookie'
import { t } from 'i18next'

import {
  encryptSession,
  cookieName as getCookieName,
  hashToken,
} from '@redwoodjs/auth-dbauth-api'

import { getEventLanguage, i18nInit } from 'src/i18n/i18n'
import { cookieName } from 'src/lib/auth'
import { db } from 'src/lib/db'

export type ProviderUser = Pick<User, 'email' | 'name'> & {
  id: string | number
}

export type GetUserVariables = {
  provider: Provider
  providerUser: ProviderUser
  accessToken: string
  scope: string
}

export type ProviderInfo = {
  provider: Provider
  clientId: string
  clientSecret: string
  redirectUri: string
  tokenUrl: string
  getUserFromToken: (accessToken: string) => Promise<ProviderUser>
}

export type OAuthTokenResponse =
  | {
      access_token: string
      scope: string | string[]
      state?: string
      error?: never
    }
  | {
      access_token?: never
      scope?: never
      state?: string
      error: string
    }

export type Response = Omit<APIGatewayProxyResult, 'body'>

export const CSRF_TOKEN = 'CSRFToken'

export const removeCSRFCookie = () => {
  return createCookie(CSRF_TOKEN, '', 0)
}

export const getCSRFCookie = (): [string, string] => {
  const csrf = randomUUID()
  const maxAge = 60 * 5
  const hashedCSRFtoken = hashToken(csrf)
  return [csrf, createCookie(CSRF_TOKEN, hashedCSRFtoken, maxAge)]
}

export const findOrCreateUser = async (
  provider: Provider,
  providerUser: ProviderUser
) => {
  const identity = await db.identity.findFirst({
    where: { provider, uid: providerUser.id.toString() },
    include: { user: true },
  })

  if (identity) {
    const { user, ...rest } = identity
    return { identity: rest, user }
  }

  return db.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email: providerUser.email },
      create: {
        email: providerUser.email,
        name: providerUser.name,
        confirmed: true,
      },
      update: { confirmed: true },
    })

    const identity = await tx.identity.create({
      data: {
        userId: user.id,
        provider,
        uid: providerUser.id.toString(),
      },
    })

    return { user, identity }
  })
}

export const getUser = async ({
  provider,
  providerUser,
  accessToken,
  scope,
}: GetUserVariables) => {
  const { identity } = await findOrCreateUser(provider, providerUser)

  const id = await db.identity.update({
    where: { id: identity.id },
    data: { accessToken, scope, lastLoginAt: new Date() },
    include: { user: true },
  })

  return id.user
}

export const secureCookie = (user: Pick<User, 'id'>) => {
  const data = JSON.stringify({ id: user.id }) // Only user ID, no sensitive data
  const encrypted = encryptSession(data)
  const cookieNameWithPort = getCookieName(cookieName)
  const maxAge = 60 * 60 * 24 * 365
  return createCookie(cookieNameWithPort, encrypted, maxAge)
}

export const secureCookieAndRedirect = (user: User): Response => {
  const userCookie = secureCookie(user)
  const csrfCookie = removeCSRFCookie()
  return redirectToLocation(process.env.WEB_URI, userCookie, csrfCookie)
}

export const redirectWithError = (error: string): Response => {
  const csrfCookie = removeCSRFCookie()

  return {
    statusCode: 307,
    headers: {
      Location: `${process.env.WEB_URI}/login?error=${error}`,
    },
    multiValueHeaders: {
      'Set-Cookie': [csrfCookie],
    },
  }
}

export const getProviderToken = async (
  providerInfo: Pick<
    ProviderInfo,
    'clientId' | 'clientSecret' | 'redirectUri' | 'tokenUrl'
  >,
  body?: Record<string, string>
): Promise<OAuthTokenResponse> => {
  const { clientId, clientSecret, redirectUri, tokenUrl } = providerInfo

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      ...body,
    }),
  })

  return await response.json()
}

export const createCookie = (
  name: string,
  value: string,
  maxAge: number,
  path = '/'
) => {
  const isDev = process.env.NODE_ENV === 'development'
  return serialize(name, value, {
    maxAge,
    httpOnly: true,
    path,
    sameSite: isDev ? 'lax' : 'strict',
    secure: !isDev,
    encode: (value) => value,
  })
}

export const redirectToLocation = (
  location: string,
  ...cookies: string[]
): Response => {
  const res: Response = {
    statusCode: 302,
    headers: { Location: location },
  }

  if (cookies.length) {
    res.multiValueHeaders = { 'Set-Cookie': cookies }
  }

  return res
}

export const providerCallback = async (
  event: APIGatewayEvent,
  providerInfo: ProviderInfo
): Promise<Response> => {
  const { provider, getUserFromToken } = providerInfo
  const { headers, queryStringParameters } = event
  const lang = getEventLanguage(event)

  await i18nInit(lang)
  const test = t('emails.confirm-user.header', { lng: lang })

  console.log({ test })

  if (!queryStringParameters) {
    return redirectWithError(
      `Sorry, we received an invalid callback from ${provider} provider`
    )
  }

  const cookies = parse(headers.cookie || '')
  const csrfCookie = cookies[CSRF_TOKEN]

  if (!csrfCookie) {
    return redirectWithError(
      'Invalid CSRF token. You may have taken too long to log in. Please try again.'
    )
  }

  const { code, state } = queryStringParameters
  if (!code || !state) {
    return redirectWithError(
      `Sorry, we received an invalid callback from ${provider} provider`
    )
  }

  if (hashToken(state) !== csrfCookie) {
    return redirectWithError(
      'CSRF token does not match with callback state. You may be a victim of CSRF attack'
    )
  }

  try {
    const {
      access_token: accessToken,
      scope,
      error,
    } = await getProviderToken(providerInfo, {
      code,
      grant_type: 'authorization_code',
    })

    if (error) return redirectWithError(error)
    if (!accessToken) {
      return redirectWithError(
        'No access token received from provider. Please try again or contact support'
      )
    }

    const providerUser = await getUserFromToken(accessToken)

    if (!providerUser?.id || !providerUser?.email) {
      return redirectWithError(
        'Invalid user data from provider. Please try again'
      )
    }

    const user = await getUser({
      provider,
      accessToken,
      providerUser,
      scope: Array.isArray(scope) ? scope.join(' ') : scope,
    })

    return secureCookieAndRedirect(user)
  } catch (error) {
    if (error instanceof Error) {
      return redirectWithError(error.message)
    }

    return redirectWithError('An unexpected error occurred')
  }
}
