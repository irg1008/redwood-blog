import {
  ChatMessage,
  ChatSubscriptionInput,
  SubscriptionObject,
} from 'types/graphql'

import { PubSub } from '@redwoodjs/realtime'

import { hasRole } from 'src/lib/auth'

export const schema = gql`
  input ChatSubscriptionInput {
    chatRoomId: String!
  }

  type Subscription {
    chatRoom(input: ChatSubscriptionInput!): ChatMessage! @skipAuth
  }
`

export type ChatRoomChannel = PubSub<{
  chatRoom: [chatRoomId: string, message: ChatMessage]
}>

const verifyRoomAccess = () => {
  if (hasRole('admin')) return

  // Maybe needs to be logged in to access room
  // Maybe check if user is blocked from room
  // Maybe check if "premium users only" and "user is premium"
}

type ChatRoomSub = SubscriptionObject<
  ChatMessage,
  string,
  never,
  { pubSub: ChatRoomChannel },
  { input: ChatSubscriptionInput }
>

const chatRoomSub: ChatRoomSub = {
  subscribe: (_, { input }, { pubSub }) => {
    verifyRoomAccess()
    return pubSub.subscribe('chatRoom', input.chatRoomId)
  },
  resolve: (payload: ChatMessage) => payload,
}

export const chatRoom = {
  chatRoom: chatRoomSub,
}
