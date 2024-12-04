import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import StreamerPage from './StreamerPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('StreamerPage', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(<StreamerPage streamerId={1} />)
    }).not.toThrow()
  })
})
