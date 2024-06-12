import { ChatMessage, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { ChatRoomChannel } from 'src/subscriptions/chatRoom/chatRoom'

export const verifyCanSendChatMessage = () => {
  requireAuth()

  // Maybe user needs to "like" the room before sending message
  // Maybe user needs to "follow" room for X days before sending message
}

export const verifyCanReadMessages = () => {
  // For the moment anyone can read messages
  // But maybe we restrict acess for logged in users only
}

const chatRooms = new Map<string, ChatMessage[]>()

export const sendChatMessage = (
  { input }: { input: ChatMessage },
  { context: subContext }: { context: { pubSub: ChatRoomChannel } }
) => {
  verifyCanSendChatMessage()

  const user = context.currentUser

  const newChatMessage: ChatMessage = {
    ...input,
    id: Math.floor(Math.random() * 1000000),
    createdAt: new Date().toISOString(),
    user: {
      id: user.id,
      displayName: user.email,
    },
  }

  const chatRoom = chatRooms.get(input.chatRoomId) || []
  chatRoom.push(newChatMessage)
  chatRooms.set(input.chatRoomId, chatRoom)

  subContext.pubSub.publish('chatRoom', input.chatRoomId, newChatMessage)

  return newChatMessage
}

export const chatMessages: QueryResolvers['chatMessages'] = ({
  chatRoomId,
}) => {
  verifyCanReadMessages()
  return chatRooms.get(chatRoomId) || []
}
