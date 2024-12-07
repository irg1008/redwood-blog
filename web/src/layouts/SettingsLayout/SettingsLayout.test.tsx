import { Router } from '@redwoodjs/router'
import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import SettingsLayout from './SettingsLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('SettingsLayout', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(
        <Router>
          <SettingsLayout />
        </Router>
      )
    }).not.toThrow()
  })
})
