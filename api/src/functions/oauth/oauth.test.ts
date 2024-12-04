import { Provider } from '@prisma/client'

import { mockHttpEvent } from '@redwoodjs/testing/api'

import { logger } from 'src/lib/logger'

import { handler } from './oauth'

describe('oauth function', () => {
  // Further testing this social login should be done with
  // e2e tests for each provider (cypress, puppeteer or playwright)

  it("returns 404 if the provider it's not implemented", async () => {
    const httpEvent = mockHttpEvent({
      path: '/oauth/unknown/callback',
    })

    const response = await handler(httpEvent)
    expect(response).toHaveProperty('statusCode', 404)

    const httpEventRedirect = mockHttpEvent({
      path: '/oauth/unknown/redirect',
    })

    const responseRedirect = await handler(httpEventRedirect)
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
      tokenError: 'Invalid authorization code',
    },
  ])('provider: %s', ({ provider, redirectUri, tokenError }) => {
    it('calls oauth endpoint', async () => {
      const httpEvent = mockHttpEvent({
        path: `/oauth/${provider}/redirect`,
      })

      const response = await handler(httpEvent)

      expect(response).toHaveProperty('statusCode', 302)
      expect(response).toHaveProperty(
        'headers.Location',
        expect.stringContaining(redirectUri)
      )
    })

    it('calls callback', async () => {
      const errorLogger = jest.spyOn(logger, 'error')

      const redirectEvent = mockHttpEvent({
        path: `/oauth/${provider}/redirect`,
      })
      const redirectResponse = await handler(redirectEvent)

      const redirectState = new URL(
        redirectResponse.headers?.Location?.toString() || ''
      ).searchParams.get('state')

      const callbackEvent = mockHttpEvent({
        path: `/oauth/${provider}/callback`,
        queryStringParameters: {
          code: '123',
          state: redirectState ?? '',
        },
        headers: {
          cookie:
            redirectResponse.multiValueHeaders?.['Set-Cookie']?.toString(),
        },
      })
      const callbackResponse = await handler(callbackEvent)

      const params = new URLSearchParams({
        error: tokenError,
        provider,
      })

      expect(callbackResponse).toHaveProperty('statusCode', 307)
      expect(callbackResponse).toHaveProperty(
        'headers.Location',
        expect.stringContaining(params.toString())
      )

      expect(errorLogger).toHaveBeenCalled()
      expect(errorLogger).toHaveBeenCalledWith(
        expect.stringContaining(tokenError)
      )
    })
  })
})
