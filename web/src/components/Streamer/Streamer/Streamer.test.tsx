import { render } from '@redwoodjs/testing/web'

import Streamer from './Streamer'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Streamer', () => {
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
