import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import Streamer from './Streamer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Streamer', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(
        <Streamer
          streamer={{
            id: 1,
            streamPath: 'stream-path',
            userId: 1,
            user: {
              id: 1,
              email: 'mail@example.com',
            },
          }}
        />
      )
    }).not.toThrow()
  })
})
