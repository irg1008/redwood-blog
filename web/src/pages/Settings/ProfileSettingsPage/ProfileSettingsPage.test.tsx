import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import ProfileSettingsPage from './ProfileSettingsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ProfileSettingsPage', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(<ProfileSettingsPage />)
    }).not.toThrow()
  })
})
