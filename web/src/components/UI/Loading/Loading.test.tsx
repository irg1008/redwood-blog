import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import Loading from './Loading'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Loading', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(<Loading />)
    }).not.toThrow()
  })
})
