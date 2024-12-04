import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import StreamVideo from './StreamVideo'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('StreamVideo', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(<StreamVideo streamUrl="" thumbnailUrl="" />)
    }).not.toThrow()
  })
})
