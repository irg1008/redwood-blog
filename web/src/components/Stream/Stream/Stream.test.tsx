import { render } from '@redwoodjs/testing/web'

import Stream from './Stream'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Stream', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <Stream
          stream={{
            createdAt: '2022-02-02T02:02:02Z',
            id: 1,
            recordingId: '',
          }}
        />
      )
    }).not.toThrow()
  })
})
