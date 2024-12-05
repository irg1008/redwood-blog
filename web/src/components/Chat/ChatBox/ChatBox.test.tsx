import { render } from '@redwoodjs/testing/web'

import ChatBox from './ChatBox'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ChatBox', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ChatBox streamId={1} />)
    }).not.toThrow()
  })
})
