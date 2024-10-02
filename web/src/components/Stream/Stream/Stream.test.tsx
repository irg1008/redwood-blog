import { render } from '@redwoodjs/testing/web'

import Stream from './Stream'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Stream', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Stream streamId={0} />)
    }).not.toThrow()
  })
})
