import { Provider } from '@prisma/client'
import type { APIGatewayEvent } from 'aws-lambda'

import {
  ProviderUser,
  getCSRFCookie,
  providerCallback,
  redirectToLocation,
} from './common'

type TwitchUser = {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  email: string
  created_at: string
}

export const callback = async (event: APIGatewayEvent) =>
  providerCallback(event, {
    provider: Provider.twitch,
    clientId: process.env.TWITCH_OAUTH_CLIENT_ID,
    clientSecret: process.env.TWITCH_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.TWITCH_OAUTH_REDIRECT_URI,
    tokenUrl: 'https://id.twitch.tv/oauth2/token',
    getUserFromToken: getTwitchUser,
  })

const getTwitchUser = async (accessToken: string): Promise<ProviderUser> => {
  const twitchUserResponse = await fetch('https://api.twitch.tv/helix/users', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-ID': process.env.TWITCH_OAUTH_CLIENT_ID,
    },
  })

  const twitchUserData: { data: TwitchUser[] } = await twitchUserResponse.json()
  if (!twitchUserData) throw new Error('No user data returned from Twitch')

  const [user] = twitchUserData.data
  return { ...user, name: user.display_name }
}

export const redirect = async () => {
  const [csrf, csrfCookie] = getCSRFCookie()

  const twitchUrl = new URL('https://id.twitch.tv/oauth2/authorize')

  twitchUrl.search = new URLSearchParams({
    client_id: process.env.TWITCH_OAUTH_CLIENT_ID,
    redirect_uri: process.env.TWITCH_OAUTH_REDIRECT_URI,
    response_type: 'code',
    scope: process.env.TWITCH_OAUTH_SCOPES,
    state: csrf,
  }).toString()

  return redirectToLocation(twitchUrl.toString(), csrfCookie)
}
