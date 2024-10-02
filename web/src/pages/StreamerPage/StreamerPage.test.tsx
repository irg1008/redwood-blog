import { render } from '@redwoodjs/testing/web'

import StreamerPage from './StreamerPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('StreamerPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<StreamerPage streamerId={1} />)
    }).not.toThrow()
  })
})
