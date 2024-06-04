import { Provider } from '@prisma/client'
import type { APIGatewayEvent } from 'aws-lambda'

import { getCSRFCookie, providerCallback, redirectToLocation } from './common'

type GithubUser = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  name: string
  company: string
  blog: string
  location: string
  email: string
  hireable: boolean
  bio: string
  twitter_username: null
  public_repos: number
  public_gists: number
  followers: number
  following: number
  created_at: Date
  updated_at: Date
  private_gists: number
  total_private_repos: number
  owned_private_repos: number
  disk_usage: number
  collaborators: number
  two_factor_authentication: boolean
  plan: Plan
}

type Plan = {
  name: string
  space: number
  collaborators: number
  private_repos: number
}

export const callback = async (event: APIGatewayEvent) =>
  providerCallback(event, {
    provider: Provider.github,
    clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
    clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.GITHUB_OAUTH_REDIRECT_URI,
    tokenUrl: 'https://github.com/login/oauth/access_token',
    getUserFromToken: getGhUser,
  })

const getGhUser = async (accessToken: string): Promise<GithubUser> => {
  const ghUserResponse = await fetch('https://api.github.com/user', {
    headers: { Authorization: `token ${accessToken}` },
  })

  return await ghUserResponse.json()
}

export const redirect = async () => {
  const [csrf, csrfCookie] = getCSRFCookie()

  const githubUrl = new URL('https://github.com/login/oauth/authorize')

  githubUrl.search = new URLSearchParams({
    client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
    redirect_uri: process.env.GITHUB_OAUTH_REDIRECT_URI,
    scope: process.env.GITHUB_OAUTH_SCOPES,
    state: csrf,
  }).toString()

  return redirectToLocation(githubUrl.toString(), csrfCookie)
}
