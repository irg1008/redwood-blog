import { Provider } from '@prisma/client'
import type { APIGatewayEvent, Handler } from 'aws-lambda'

import { Response } from './providers/common'
import {
  callback as githubCallback,
  redirect as githubRedirect,
} from './providers/github/github'
import {
  callback as googleCallback,
  redirect as googleRedirect,
} from './providers/google/google'
import {
  callback as twitchCallback,
  redirect as twitchRedirect,
} from './providers/twitch/twitch'

type Action = 'callback' | 'redirect'
type AllowedPath = `/oauth/${Provider}/${Action}`

type FunctionForAction = (event: APIGatewayEvent) => Promise<Response>

const actions: Record<AllowedPath, FunctionForAction> = {
  '/oauth/github/callback': githubCallback,
  '/oauth/github/redirect': githubRedirect,
  '/oauth/google/callback': googleCallback,
  '/oauth/google/redirect': googleRedirect,
  '/oauth/twitch/callback': twitchCallback,
  '/oauth/twitch/redirect': twitchRedirect,
}

const isValidAction = (path: string): path is AllowedPath =>
  Object.keys(actions).includes(path)

export const handler: Handler<APIGatewayEvent, Response> = async (event) => {
  const { path } = event
  return isValidAction(path) ? actions[path](event) : { statusCode: 404 }
}
