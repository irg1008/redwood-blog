import { Provider } from '@prisma/client'

import { mockContext, mockHttpEvent } from '@redwoodjs/testing/api'

import { handler } from './oauth'

describe('oauth function', () => {
  // Further testing this social login should be done with
  // e2e tests for each provider (cypress, puppeteer or playwright)

  it("returns 404 if the provider it's not implemented", async () => {
    const httpEvent = mockHttpEvent({
      path: '/oauth/unknown/callback',
    })

    const response = await handler(httpEvent, mockContext())
    expect(response).toHaveProperty('statusCode', 404)

    const httpEventRedirect = mockHttpEvent({
      path: '/oauth/unknown/redirect',
    })

    const responseRedirect = await handler(httpEventRedirect, mockContext())
    expect(responseRedirect).toHaveProperty('statusCode', 404)
  })

  describe.each([
    {
      provider: Provider.github,
      redirectUri: 'https://github.com/login/oauth/authorize',
      tokenError: 'bad_verification_code',
    },
    {
      provider: Provider.google,
      redirectUri: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenError: 'invalid_grant',
    },
    {
      provider: Provider.twitch,
      redirectUri: 'https://id.twitch.tv/oauth2/authorize',
      tokenError: 'Invalid OAuth token',
    },
  ])('provider: %s', ({ provider, redirectUri, tokenError }) => {
    it('calls oauth endpoint', async () => {
      const httpEvent = mockHttpEvent({
        path: `/oauth/${provider}/redirect`,
      })

      const response = await handler(httpEvent, mockContext())

      expect(response).toHaveProperty('statusCode', 302)
      expect(response).toHaveProperty(
        'headers.Location',
        expect.stringContaining(redirectUri)
      )
    })

    it('calls callback', async () => {
      const redirectEvent = mockHttpEvent({
        path: `/oauth/${provider}/redirect`,
      })
      const redirectResponse = await handler(redirectEvent, mockContext())

      const redirectState = new URL(
        redirectResponse.headers?.Location
      ).searchParams.get('state')

      const callbackEvent = mockHttpEvent({
        path: `/oauth/${provider}/callback`,
        queryStringParameters: {
          code: '123',
          state: redirectState,
        },
        headers: {
          cookie: redirectResponse.headers['Set-Cookie'],
        },
      })
      const callbackResponse = await handler(callbackEvent, mockContext())

      expect(callbackResponse).toHaveProperty('statusCode', 307)
      expect(callbackResponse).toHaveProperty(
        'headers.Location',
        expect.stringContaining(tokenError)
      )
    })
  })
})
