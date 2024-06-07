import { randomUUID } from 'crypto'

import { Provider, User } from '@prisma/client'
import type { APIGatewayEvent } from 'aws-lambda'
import { serialize } from 'cookie'
import parse from 'set-cookie-parser'

import {
  encryptSession,
  cookieName as getCookieName,
  hashToken,
} from '@redwoodjs/auth-dbauth-api'

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
  })

  if (identity) {
    const user = await db.user.findUnique({
      where: { id: identity.userId },
    })

    return { user, identity }
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
  const { user, identity } = await findOrCreateUser(provider, providerUser)

  await db.identity.update({
    where: { id: identity.id },
    data: { accessToken, scope, lastLoginAt: new Date() },
  })

  return user
}

export const secureCookie = (user: User) => {
  const data = JSON.stringify({ id: user.id }) // Only user ID, no sensitive data
  const encrypted = encryptSession(data)
  const cookieNameWithPort = getCookieName(cookieName)
  const maxAge = 60 * 60 * 24 * 365
  return createCookie(cookieNameWithPort, encrypted, maxAge)
}

export const secureCookieAndRedirect = (user: User) => {
  const userCookie = secureCookie(user)
  const csrfCookie = removeCSRFCookie()
  return redirectToLocation('/', userCookie, csrfCookie)
}

export const redirectWithError = (error: string) => {
  const csrfCookie = removeCSRFCookie()
  return {
    statusCode: 307,
    headers: {
      Location: `/login?error=${error}`,
      'Set-Cookie': csrfCookie,
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

export const redirectToLocation = (location: string, ...cookies: string[]) => {
  const res = {
    statusCode: 302,
    headers: { Location: location },
  }

  if (cookies.length) {
    res.headers['Set-Cookie'] = cookies
  }

  return res
}

export const providerCallback = async (
  event: APIGatewayEvent,
  providerInfo: ProviderInfo
) => {
  const cookies = parse(event.headers.cookie, {
    map: true,
    decodeValues: false,
  })

  const csrfCookie = cookies[CSRF_TOKEN]
  if (!csrfCookie) {
    return redirectWithError(
      'Invalid CSRF token. You may have taken too long to log in. Please try again.'
    )
  }

  const { provider, getUserFromToken } = providerInfo

  const { code, state } = event.queryStringParameters
  if (!code || !state) {
    return redirectWithError(
      `Sorry, we received an invalid callback from ${provider} provider`
    )
  }

  if (hashToken(state) !== csrfCookie.value) {
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
    return redirectWithError(error.message)
  }
}
