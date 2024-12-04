import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import ArticlePage from './ArticlePage'

describe('ArticlePage', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(<ArticlePage slug="example" />)
    }).not.toThrow()
  })
})
