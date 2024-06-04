import { mockContext, mockHttpEvent } from '@redwoodjs/testing/api'

import { handler } from './oauth'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-functions

jest.spyOn(global, 'fetch')

describe('oauth function', () => {
  // Testing this social login should be done with e2e tests for each provider (cypress, puppeteer or playwright)
  // This is because it's diffcult to mock the OAuth flow in a unit test

  it("returns 404 if the provider it's not implemented", async () => {
    const httpEvent = mockHttpEvent({
      path: '/oauth/unknown/callback',
    })

    const response = await handler(httpEvent, mockContext())
    expect(response).toHaveProperty('statusCode', 404)
  })
})
