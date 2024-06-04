import { randomUUID } from 'crypto'

import { Provider, User } from '@prisma/client'
import type { APIGatewayEvent } from 'aws-lambda'
import { serialize } from 'cookie'
import parse from 'set-cookie-parser'

import {
  encryptSession,
  cookieName as getCookieName,
} from '@redwoodjs/auth-dbauth-api'

import { cookieName } from 'src/lib/auth'
import { db } from 'src/lib/db'

export type ProviderUser = Pick<User, 'email' | 'name'> & {
  id: string | number
}

type GetUserVariables = {
  provider: Provider
  providerUser: ProviderUser
  accessToken: string
  scope: string
}

type ProviderInfo = {
  provider: Provider
  clientId: string
  clientSecret: string
  redirectUri: string
  tokenUrl: string
  getUserFromToken: (accessToken: string) => Promise<ProviderUser>
}

type OAuthTokenResponse =
  | {
      access_token: string
      scope: string | string[]
      state?: string
      error: never
    }
  | {
      access_token: never
      scope: never
      state?: string
      error: string
    }

const CSRF_TOKEN = 'CSRFToken'

const removeCSRFCookie = () => {
  return createCookie(CSRF_TOKEN, null, 0)
}

export const getCSRFCookie = (): [string, string] => {
  const csrf = randomUUID()
  const maxAge = 60 * 10
  return [csrf, createCookie(CSRF_TOKEN, csrf, maxAge)]
}

const getUser = async ({
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

const findOrCreateUser = async (
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

  const userData = {
    email: providerUser.email,
    name: providerUser.name,
  }

  return db.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email: userData.email },
      create: userData,
      update: {},
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

const secureCookie = (user: User) => {
  const data = JSON.stringify({ id: user.id, email: user.email })

  const encrypted = encryptSession(data)
  const cookieNameWithPort = getCookieName(cookieName)

  const maxAge = 60 * 60 * 24 * 365

  return createCookie(cookieNameWithPort, encrypted, maxAge)
}

const secureCookieAndRedirect = (user: User) => {
  try {
    const userCookie = secureCookie(user)
    const csrfCookie = removeCSRFCookie()
    return redirectToLocation('/', userCookie, csrfCookie)
  } catch (error) {
    return redirectWithError(error.message)
  }
}

export const redirectWithError = (error: string) => ({
  statusCode: 307,
  headers: { Location: `/login?error=${error}` },
})

const getProviderToken = async (
  providerInfo: ProviderInfo,
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

const createCookie = (
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
  return {
    statusCode: 302,
    headers: { Location: location, 'Set-Cookie': cookies },
  }
}

export const providerCallback = async (
  event: APIGatewayEvent,
  providerInfo: ProviderInfo
) => {
  const cookies = parse(event.headers.cookie, {
    map: true,
    decodeValues: false,
  })

  const csrffCookie = cookies[CSRF_TOKEN]
  if (!csrffCookie) {
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

  if (state !== csrffCookie.value) {
    return redirectWithError(
      'CSRF token does not match with callback state. You may be a victim of CSRF attack'
    )
  }

  const {
    access_token: accessToken,
    scope,
    error,
  } = await getProviderToken(providerInfo, {
    code,
    grant_type: 'authorization_code',
  })

  if (error) return redirectWithError(error)

  try {
    const providerUser = await getUserFromToken(accessToken)

    if (!providerUser?.id) {
      return redirectWithError(
        'We were not able to find a user. Please try again'
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
