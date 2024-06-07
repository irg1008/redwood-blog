import { Provider } from '@prisma/client'
import type { APIGatewayEvent, Context } from 'aws-lambda'

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

type HandlerRes = {
  statusCode: number
  headers?: {
    'Set-Cookie'?: string
    Location: string
  }
}
type FunctionForAction<A extends Action> = A extends 'callback'
  ? (event: APIGatewayEvent) => Promise<HandlerRes>
  : () => Promise<HandlerRes>

const actions: Record<AllowedPath, FunctionForAction<Action>> = {
  '/oauth/github/callback': githubCallback,
  '/oauth/github/redirect': githubRedirect,
  '/oauth/google/callback': googleCallback,
  '/oauth/google/redirect': googleRedirect,
  '/oauth/twitch/callback': twitchCallback,
  '/oauth/twitch/redirect': twitchRedirect,
}
export const handler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<HandlerRes> => {
  const action = actions[event.path as AllowedPath]
  return action?.(event) ?? { statusCode: 404 }
}
