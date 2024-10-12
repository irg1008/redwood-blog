import {
  ChatMessage,
  ChatSubscriptionInput,
  SubscriptionObject,
} from 'types/graphql'

import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server'
import { PubSub, RedisLiveQueryStore } from '@redwoodjs/realtime'

import { hasRole } from 'src/lib/auth'

export const schema = gql`
  input ChatSubscriptionInput {
    streamId: Int!
  }

  type Subscription {
    chatRoom(input: ChatSubscriptionInput!): ChatMessage! @skipAuth
  }
`

export type ChatRoomChannel = PubSub<{
  chatRoom: [streamId: number, message: ChatMessage]
}>

export type ChatRoomContext = RedwoodGraphQLContext & {
  pubSub: ChatRoomChannel
  liveQueryStore: RedisLiveQueryStore
}

export type ChatRoomSub = SubscriptionObject<
  ChatMessage,
  string,
  never,
  ChatRoomContext,
  { input: ChatSubscriptionInput }
>

const verifyRoomAccess = () => {
  if (hasRole('admin')) return

  // Maybe needs to be logged in to access room
  // Maybe check if user is blocked from room
  // Maybe check if "premium users only" and "user is premium"
}

const chatRoomSub: ChatRoomSub = {
  subscribe: (_, { input }, { pubSub }) => {
    verifyRoomAccess()
    return pubSub.subscribe('chatRoom', input.streamId)
  },
  resolve: (payload: ChatMessage) => payload,
}

export const chatRoom = {
  chatRoom: chatRoomSub,
}
