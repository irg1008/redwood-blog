import { render } from '@redwoodjs/testing/web'

import ChatInput from './ChatInput'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ChatInput', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ChatInput />)
    }).not.toThrow()
  })
})
