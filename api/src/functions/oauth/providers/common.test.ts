import type { Provider } from '@prisma/client'

import {
  decryptSession,
  cookieName as getCookieName,
  getSession,
  hashToken,
} from '@redwoodjs/auth-dbauth-api'
import { mockHttpEvent } from '@redwoodjs/testing/api'

import { cookieName } from 'src/lib/auth'
import { db } from 'src/lib/db'

import {
  CSRF_TOKEN,
  OAuthTokenResponse,
  ProviderInfo,
  ProviderUser,
  createCookie,
  findOrCreateUser,
  getCSRFCookie,
  getProviderToken,
  getUser,
  providerCallback,
  redirectToLocation,
  redirectWithError,
  removeCSRFCookie,
  secureCookie,
  secureCookieAndRedirect,
} from './common'
import {
  ExistingUserScenario,
  FoundIdentityScenario,
  defaultAccessToken,
  defaultScope,
  provider,
  providerUser,
} from './common.scenarios'

const randomUUIDSpy = jest.spyOn(require('crypto'), 'randomUUID')

const emptyCSRFTokenCookie = `${CSRF_TOKEN}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`

const validTokenResponse: OAuthTokenResponse = {
  access_token: '123456',
  scope: 'scope',
  state: 'state',
}

const redirectOAuthResponse = () => {
  const [csrf, csrfCookie] = getCSRFCookie()
  return {
    event: mockHttpEvent({
      queryStringParameters: {
        code: 'validCode00',
        state: csrf,
      },
      headers: {
        // The providers return "cookie", not "Cookie" or "Set-Cookie"
        cookie: csrfCookie,
      },
    }),
    csrf,
    csrfCookie,
  }
}

const mockValidTokenResponse = () => {
  const validTokenMock = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(validTokenResponse),
      ok: true,
    })
  ) as jest.Mock

  const fetchMock = jest
    .spyOn(global, 'fetch')
    .mockImplementation(validTokenMock)

  return fetchMock
}

describe('common oauth provider functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates a cookie to remove CSRF token', () => {
    const removeCookie = removeCSRFCookie()
    expect(removeCookie).toEqual(emptyCSRFTokenCookie)
  })

  it('creates a csrf token and cookie using UUID', () => {
    const [csrf, cookie] = getCSRFCookie()

    expect(randomUUIDSpy).toHaveBeenCalledTimes(1)

    const hashedCSRF = hashToken(csrf)
    expect(cookie).toEqual(
      `${CSRF_TOKEN}=${hashedCSRF}; Max-Age=300; Path=/; HttpOnly; Secure; SameSite=Strict`
    )
  })

  scenario(
    'finds existing user and identityr',
    async (foundIdentityScenario: FoundIdentityScenario) => {
      const githubProvider = foundIdentityScenario.identity.github

      const { user, identity } = await findOrCreateUser(provider, providerUser)

      expect(identity).toEqual(githubProvider)
      expect(identity.userId).toEqual(user.id)

      expect(user.email).toEqual(providerUser.email)
      expect(user.name).toEqual(providerUser.name)
      expect(user.confirmed).toEqual(true)
    }
  )

  scenario(
    'existingUser',
    "confirms an existing user that's not confirmed when connecting a provider",
    async (existingUserScenario: ExistingUserScenario) => {
      const { unconfirmed } = existingUserScenario.user

      expect(unconfirmed.confirmed).toEqual(false)

      const { user } = await findOrCreateUser(provider, providerUser)
      expect(user.confirmed).toEqual(true)
    }
  )

  scenario(
    'existingUser',
    "keeps a confirmed user's status when connecting a provider",
    async (existingUserScenario: ExistingUserScenario) => {
      const { alreadyConfirmed } = existingUserScenario.user

      expect(alreadyConfirmed.confirmed).toEqual(true)

      const { user } = await findOrCreateUser(provider, providerUser)
      expect(user.confirmed).toEqual(true)
    }
  )

  scenario(
    'user is able to connect second provider, keeping previous data',
    async (_foundIdentityScenario: FoundIdentityScenario) => {
      const { user } = await findOrCreateUser(provider, providerUser)

      // Connnect with a new provider
      const newProviderUser: ProviderUser = {
        id: '212123',
        email: user.email,
        name: 'My very cool google name',
      }

      const { user: sameUser, identity: newIdentity } = await findOrCreateUser(
        'google',
        newProviderUser
      )
      expect(newIdentity.userId).toEqual(user.id)

      // User should be kept as is
      expect(sameUser).toEqual(user)

      // Now user should have 2 identities
      const identities = await db.identity.findMany({
        where: { userId: user.id },
      })

      expect(identities).toHaveLength(2)
    }
  )

  it('creates a brand new user and identity', async () => {
    const newProviderUser: ProviderUser = {
      id: '212123',
      email: 'user@mail.com',
      name: 'My very cool twitch name',
    }
    const provider: Provider = 'twitch'

    const identity = await db.identity.findFirst({
      where: { provider, uid: newProviderUser.id.toString() },
    })
    expect(identity).toBeNull()

    const existingUser = await db.user.findFirst({
      where: { email: newProviderUser.email },
    })
    expect(existingUser).toBeNull()

    const { user, identity: newIdentity } = await findOrCreateUser(
      provider,
      newProviderUser
    )

    expect(newIdentity.provider).toEqual(provider)
    expect(newIdentity.uid).toEqual(newProviderUser.id.toString())
    expect(newIdentity.userId).toEqual(user.id)

    expect(user.email).toEqual(newProviderUser.email)
    expect(user.name).toEqual(newProviderUser.name)
    expect(user.confirmed).toEqual(true)

    // Does not set the access token and very often updated data here
    expect(newIdentity.lastLoginAt).not.toBeNull()
    expect(newIdentity.accessToken).toBeNull()
    expect(newIdentity.scope).toBeNull()
  })

  scenario(
    'should update access token and scope data to connected provider',
    async (foundIdentityScenario: FoundIdentityScenario) => {
      const identity = foundIdentityScenario.identity.github
      expect(identity.accessToken).toEqual(defaultAccessToken)
      expect(identity.scope).toEqual(defaultScope)

      const newAccessToken = 'newAccessToken'
      const newScope = 'newScope'
      const user = await getUser({
        provider,
        providerUser,
        accessToken: newAccessToken,
        scope: newScope,
      })

      const updatedIdentity = await db.identity.findFirst({
        where: { id: identity.id },
        include: { user: true },
      })

      expect(user).toBeDefined()
      expect(user).toEqual(updatedIdentity.user)

      expect(updatedIdentity.accessToken).toEqual(newAccessToken)
      expect(updatedIdentity.scope).toEqual(newScope)

      expect(updatedIdentity.lastLoginAt).toBeDefined()
      expect(updatedIdentity.lastLoginAt).toBeInstanceOf(Date)
      expect(updatedIdentity.lastLoginAt.getTime()).toBeGreaterThan(
        identity.lastLoginAt.getTime()
      )
    }
  )

  scenario(
    'existingUser',
    'creates a secure session cookie with valid name and data',
    async (existingUsersScenario: ExistingUserScenario) => {
      const user = existingUsersScenario.user.alreadyConfirmed
      const cookie = secureCookie(user)

      const session = getSession(cookie, cookieName)
      const [sessionValue] = decryptSession(session)
      expect(sessionValue).toEqual({ id: user.id })

      const sessionCookieName = getCookieName(cookieName)

      expect(cookie).toBeDefined()
      expect(cookie).toEqual(
        `${sessionCookieName}=${session}; Max-Age=31536000; Path=/; HttpOnly; Secure; SameSite=Strict`
      )
    }
  )

  scenario(
    'existingUser',
    'should create secure cookie and remove CSRF on valid provider login',
    async (existingUsersScenario: ExistingUserScenario) => {
      const user = existingUsersScenario.user.unconfirmed

      const res = secureCookieAndRedirect(user)

      expect(res).toHaveProperty('statusCode', 302)
      expect(res).toHaveProperty('headers.Location', '/')
      expect(res).toHaveProperty('headers.Set-Cookie')

      const cookies = res.headers['Set-Cookie']
      expect(cookies).toBeDefined()
      expect(cookies).toEqual(
        expect.arrayContaining([
          expect.stringContaining(`${getCookieName(cookieName)}=`), // Secure cookie
          emptyCSRFTokenCookie, // CSRF remove cookie
        ])
      )
    }
  )

  it('should remove csrf cookie and redirect to login with error', () => {
    expect(redirectWithError('error')).toEqual({
      statusCode: 307,
      headers: {
        Location: `/login?error=error`,
        'Set-Cookie': emptyCSRFTokenCookie,
      },
    })
  })

  it('receives mocked token information from provider tokenUrl in correct format', async () => {
    const providerOAuthInfo: Parameters<typeof getProviderToken>[0] = {
      clientId: 'clientId',
      clientSecret: 'client_secret',
      redirectUri: 'redirectUri',
      tokenUrl: 'http://tokenUrl.com',
    }
    const additionalData = { other: 'data' }

    const fetchMock = mockValidTokenResponse()

    const res = await getProviderToken(providerOAuthInfo, additionalData)
    expect(res).toEqual(validTokenResponse)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    const { tokenUrl, clientId, clientSecret, redirectUri } = providerOAuthInfo
    expect(fetchMock).toHaveBeenCalledWith(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        ...additionalData,
      }),
    })
  })

  it('correctly formats a cookie given basic data', () => {
    expect(createCookie('name', 'value', 100)).toEqual(
      'name=value; Max-Age=100; Path=/; HttpOnly; Secure; SameSite=Strict'
    )

    expect(createCookie('name', 'value', 0)).toEqual(
      'name=value; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict'
    )

    expect(createCookie('name', 'value', 1000, '/my/custom/path')).toEqual(
      'name=value; Max-Age=1000; Path=/my/custom/path; HttpOnly; Secure; SameSite=Strict'
    )
  })

  it('redirects to location with 302 and optional cookies', () => {
    expect(redirectToLocation('http://example.com')).toEqual({
      statusCode: 302,
      headers: { Location: 'http://example.com' },
    })

    expect(
      redirectToLocation('http://example.com', 'cookie1', 'cookie2')
    ).toEqual({
      statusCode: 302,
      headers: {
        Location: 'http://example.com',
        'Set-Cookie': ['cookie1', 'cookie2'],
      },
    })

    expect(
      redirectToLocation('http://example.com', 'cookie1', 'cookie2', 'cookie3')
    ).toEqual({
      statusCode: 302,
      headers: {
        Location: 'http://example.com',
        'Set-Cookie': ['cookie1', 'cookie2', 'cookie3'],
      },
    })
  })

  describe('callback provider', () => {
    let providerInfo: ProviderInfo

    beforeEach(() => {
      providerInfo = {
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        getUserFromToken: async () => providerUser,
        provider,
        redirectUri: '/oauth/<provider>/callback',
        tokenUrl: 'http://tokenUrl.com',
      }
    })

    it('csrf token is sent plain to oauth state and hashed when set as a cookie', () => {
      const { csrf, csrfCookie } = redirectOAuthResponse()
      const hashedCsrfValue = hashToken(csrf)
      expect(csrfCookie).toEqual(
        expect.stringContaining(`${CSRF_TOKEN}=${hashedCsrfValue}`)
      )
    })

    it('calling the callback with no cookie should throw error', async () => {
      const { event } = redirectOAuthResponse()

      // No headers (no cookie)
      delete event.headers.cookie

      const callbackRes = await providerCallback(event, providerInfo)

      expect(callbackRes).toHaveProperty('statusCode', 307)
      expect(callbackRes).toHaveProperty(
        'headers.Location',
        expect.stringContaining(
          'Invalid CSRF token. You may have taken too long to log in. Please try again.'
        )
      )
    })

    it.each([
      {
        state: 'value',
        code: undefined,
      },
      {
        state: undefined,
        code: 'value',
      },
    ])(
      'should redirect to login with error on empty query param',
      async (params) => {
        const { event } = redirectOAuthResponse()

        event.queryStringParameters = params

        const callbackRes = await providerCallback(event, providerInfo)
        expect(callbackRes).toHaveProperty('statusCode', 307)
        expect(callbackRes).toHaveProperty(
          'headers.Location',
          expect.stringContaining(
            `Sorry, we received an invalid callback from ${providerInfo.provider} provider`
          )
        )
      }
    )

    it('invalid state should throw error', async () => {
      const { event } = redirectOAuthResponse()

      event.queryStringParameters.state = 'invalid'

      const callbackRes = await providerCallback(event, providerInfo)
      expect(callbackRes).toHaveProperty('statusCode', 307)
      expect(callbackRes).toHaveProperty(
        'headers.Location',
        expect.stringContaining(
          'CSRF token does not match with callback state. You may be a victim of CSRF attack'
        )
      )
    })

    it('should return error if error thrown on fetch', async () => {
      const { event } = redirectOAuthResponse()

      const invalidTokenMock = jest.fn(() =>
        // No ok nor json function for fetch response
        Promise.resolve({})
      ) as jest.Mock

      const fetchMock = jest
        .spyOn(global, 'fetch')
        .mockImplementation(invalidTokenMock)

      const callbackRes = await providerCallback(event, providerInfo)

      expect(fetchMock).toHaveBeenCalledTimes(1)

      expect(callbackRes).toHaveProperty('statusCode', 307)
      expect(callbackRes).toHaveProperty(
        'headers.Location',
        expect.stringContaining('response.json is not a function')
      )
    })

    it('should return error if token response has error', async () => {
      const { event } = redirectOAuthResponse()

      const invalidTokenMock = jest.fn(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve<OAuthTokenResponse>({
              error: 'Oh no you sent invalid client id or data',
            }),
          ok: false,
        })
      ) as jest.Mock

      const fetchMock = jest
        .spyOn(global, 'fetch')
        .mockImplementation(invalidTokenMock)

      const callbackRes = await providerCallback(event, providerInfo)

      expect(fetchMock).toHaveBeenCalledTimes(1)

      expect(callbackRes).toHaveProperty('statusCode', 307)
      expect(callbackRes).toHaveProperty(
        'headers.Location',
        expect.stringContaining('Oh no you sent invalid client id or data')
      )
    })

    it('if an error is thrown from getUserToken the error is catch', async () => {
      mockValidTokenResponse()

      const { event } = redirectOAuthResponse()

      providerInfo.getUserFromToken = async () => {
        throw new Error('Oh no, an error from getUserFromToken')
      }

      const res = await providerCallback(event, providerInfo)

      expect(res).toHaveProperty('statusCode', 307)
      expect(res).toHaveProperty(
        'headers.Location',
        expect.stringContaining('Oh no, an error from getUserFromToken')
      )
    })

    it('access token requests includes all necessary data in correct format', async () => {
      const fetchMock = mockValidTokenResponse()

      const { event } = redirectOAuthResponse()
      await providerCallback(event, providerInfo)

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(providerInfo.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: providerInfo.clientId,
          client_secret: providerInfo.clientSecret,
          redirect_uri: providerInfo.redirectUri,
          code: event.queryStringParameters.code,
          grant_type: 'authorization_code',
        }),
      })
    })

    it.each([
      { id: undefined, email: 'valid@email.com' },
      { id: 1, email: undefined },
    ])(
      "should return error if provider user doesn't have all necessary data",
      async (params) => {
        const { event } = redirectOAuthResponse()

        providerInfo.getUserFromToken = async () => params as ProviderUser

        const res = await providerCallback(event, providerInfo)

        expect(res).toHaveProperty('statusCode', 307)
        expect(res).toHaveProperty(
          'headers.Location',
          expect.stringContaining(
            'Invalid user data from provider. Please try again'
          )
        )
      }
    )

    it('a user and identity should be created if all data is valid', async () => {
      const fetchMock = mockValidTokenResponse()

      const userResolvedValue = await providerInfo.getUserFromToken(
        validTokenResponse.access_token
      )

      const { event } = redirectOAuthResponse()
      const res = await providerCallback(event, providerInfo)

      expect(fetchMock).toHaveBeenCalledTimes(1)

      const insertedIdentity = await db.identity.findFirst({
        where: { uid: userResolvedValue.id.toString() },
        include: { user: true },
      })

      expect(insertedIdentity).toBeDefined()
      expect(insertedIdentity.provider).toEqual(providerInfo.provider)
      expect(insertedIdentity.scope).toEqual(validTokenResponse.scope)
      expect(insertedIdentity.accessToken).toEqual(
        validTokenResponse.access_token
      )

      expect(insertedIdentity.user.email).toEqual(userResolvedValue.email)
      expect(insertedIdentity.user.name).toEqual(userResolvedValue.name)

      expect(res).toHaveProperty('statusCode', 302)
      expect(res).toHaveProperty('headers.Location', '/')
      expect(res).toHaveProperty('headers.Set-Cookie')
      expect(res.headers['Set-Cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining(`${getCookieName(cookieName)}=`),
          emptyCSRFTokenCookie,
        ])
      )
    })
  })
})
