import { Provider } from '@prisma/client'
import type { APIGatewayEvent } from 'aws-lambda'

import { getCSRFCookie, providerCallback, redirectToLocation } from './common'

type GoogleUser = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

export const callback = async (event: APIGatewayEvent) =>
  providerCallback(event, {
    provider: Provider.google,
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    tokenUrl: 'https://oauth2.googleapis.com/token',
    getUserFromToken: getGoogleUser,
  })

const getGoogleUser = async (accessToken: string): Promise<GoogleUser> => {
  const googleUserResponse = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  return await googleUserResponse.json()
}

export const redirect = async () => {
  const [csrf, csrfCookie] = getCSRFCookie()

  const googleUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')

  googleUrl.search = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
    response_type: 'code',
    scope: process.env.GOOGLE_OAUTH_SCOPES,
    state: csrf,
  }).toString()

  return redirectToLocation(googleUrl.toString(), csrfCookie)
}
