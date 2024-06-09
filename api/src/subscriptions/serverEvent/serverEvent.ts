import {
  MutationsendServerEventArgs,
  ServerEventResult,
  SubscriptionObject,
  User,
} from 'types/graphql'

import { ForbiddenError } from '@redwoodjs/graphql-server'
import { PubSub } from '@redwoodjs/realtime'

import { hasRole } from 'src/lib/auth'
import { getRoomIdForServerEvent } from 'src/services/serverEvent/serverEvent'

export const schema = gql`
  input ServerEventInput {
    userId: Int!
    topic: String!
  }

  type Subscription {
    serverEvent(input: ServerEventInput!): ServerEventResult! @requireAuth
  }
`

export type ServerEventChannel = PubSub<{
  serverEvent: [userTopicRoomId: string, result: ServerEventResult]
}>

const verifySubAccess = (useId: User['id']) => {
  if (hasRole('admin')) return

  if (useId !== context.currentUser?.id)
    throw new ForbiddenError("You can't subscribe to another user's events")
}

type ServerEventSub = SubscriptionObject<
  ServerEventResult,
  string,
  never,
  { pubSub: ServerEventChannel },
  MutationsendServerEventArgs
>

const serverEventsub: ServerEventSub = {
  subscribe: (_, { input }, { pubSub }) => {
    verifySubAccess(input.userId)
    return pubSub.subscribe('serverEvent', getRoomIdForServerEvent(input))
  },
  resolve: (payload: ServerEventResult) => payload,
}

export const serverEvent = {
  serverEvent: serverEventsub,
}
