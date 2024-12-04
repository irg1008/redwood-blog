import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import AboutPage from './AboutPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('AboutPage', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(<AboutPage />)
    }).not.toThrow()
  })
})
