import { render, screen, waitFor } from '@redwoodjs/testing'

import { i18nInit } from 'src/i18n/i18n'

import BlogLayout from './BlogLayout'

const EMAIL = 'example@example.com'

const logIn = () => {
  mockCurrentUser({ id: 1, email: EMAIL, roles: 'moderator' })
}

const logOut = () => {
  mockCurrentUser(null)
}

describe('BlogLayout', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('displays a Login link when not logged in', async () => {
    logOut()
    render(<BlogLayout />)

    await waitFor(() =>
      expect(screen.getByText('common.login')).toBeInTheDocument()
    )
  })

  it('displays a Logout link when logged in', async () => {
    logIn()
    render(<BlogLayout />)

    await waitFor(() =>
      expect(screen.getByText('common.logout')).toBeInTheDocument()
    )
  })

  it("displays a logged in user's email address", async () => {
    logIn()
    render(<BlogLayout />)

    await waitFor(() => expect(screen.getByText(EMAIL)).toBeInTheDocument())
  })
})
