import { ChatMessage, SubscriptionResolvers } from 'types/graphql'

import { RedwoodGraphQLContext } from '@redwoodjs/graphql-server'
import { PubSub, RedisLiveQueryStore } from '@redwoodjs/realtime'

import { hasRole } from 'src/auth'

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

const verifyRoomAccess = () => {
  if (hasRole('admin')) return

  // TODO:
  // Maybe needs to be logged in to access room
  // Maybe check if user is blocked from room
  // Maybe check if "premium users only" and "user is premium"
}

const chatRoomSub: SubscriptionResolvers<ChatRoomContext>['chatRoom'] = {
  subscribe: (_, { input }, { pubSub }) => {
    verifyRoomAccess()
    return pubSub.subscribe('chatRoom', input.streamId)
  },
  resolve: (payload: ChatMessage) => payload,
}

export const chatRoom = {
  chatRoom: chatRoomSub,
}
