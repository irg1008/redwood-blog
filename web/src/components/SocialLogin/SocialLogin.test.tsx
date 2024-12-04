import { render, screen } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import SocialLogin from './SocialLogin'

const socialProviders = [
  {
    name: 'github',
    href: '/oauth/github/redirect',
    backgroundColor: '51 51 51',
  },
  {
    name: 'google',
    href: '/oauth/google/redirect',
    backgroundColor: '66, 133, 244',
  },
  {
    name: 'twitch',
    href: '/oauth/twitch/redirect',
    backgroundColor: '100, 65, 164',
  },
]

describe('SocialLogin', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(<SocialLogin />)
    }).not.toThrow()
  })

  beforeEach(() => {
    render(<SocialLogin />)
  })

  socialProviders.forEach(({ name, href, backgroundColor }, index) => {
    it(`contains a link to the ${name} OAuth provider`, () => {
      const socialLink = screen.getAllByTitle('social.action.login.with')[index]

      expect(socialLink).toBeInTheDocument()
      expect(socialLink).toBeInstanceOf(HTMLAnchorElement)
      expect(socialLink).toHaveAttribute('href', href)
      expect(socialLink).toHaveStyle(`background-color: rgb(${backgroundColor}`)
    })
  })
})
