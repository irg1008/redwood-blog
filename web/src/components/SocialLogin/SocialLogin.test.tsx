import { render, screen } from '@redwoodjs/testing/web'

import SocialLogin from './SocialLogin'

describe('SocialLogin', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SocialLogin />)
    }).not.toThrow()
  })

  it('contains a link to the Google OAuth provider', () => {
    render(<SocialLogin />)

    const googleLink = screen.getByTitle('Log In with Google')

    expect(googleLink).toBeInTheDocument()
    expect(googleLink).toBeInstanceOf(HTMLAnchorElement)
    expect(googleLink).toHaveAttribute(
      'href',
      '/.redwood/functions/oauth/google/redirect'
    )
  })

  it('contains a link to the GitHub OAuth provider', () => {
    render(<SocialLogin />)

    const githubLink = screen.getByTitle('Log In with Github')

    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toBeInstanceOf(HTMLAnchorElement)
    expect(githubLink).toHaveAttribute(
      'href',
      '/.redwood/functions/oauth/github/redirect'
    )
  })

  it('contains a link to the Twitch OAuth provider', () => {
    render(<SocialLogin />)

    const twitchLink = screen.getByTitle('Log In with Twitch')

    expect(twitchLink).toBeInTheDocument()
    expect(twitchLink).toBeInstanceOf(HTMLAnchorElement)
    expect(twitchLink).toHaveAttribute(
      'href',
      '/.redwood/functions/oauth/twitch/redirect'
    )
  })
})
