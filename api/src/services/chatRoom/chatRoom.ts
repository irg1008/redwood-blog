import { randomUUID } from 'crypto'

import { ChatMessage, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { ChatRoomChannel } from 'src/subscriptions/chatRoom/chatRoom'

import { chatWorker } from './chatRoom.worker'

export const verifyCanSendMessage = () => {
  requireAuth()

  // Maybe user needs to "like" the room before sending message
  // Maybe user needs to "follow" room for X days before sending message
}

export const verifyCanReadMessages = () => {
  // For the moment anyone can read messages
  // But maybe we restrict acess for logged in users only
}

export const sendChatMessage = (
  { input }: { input: ChatMessage },
  { context: subContext }: { context: { pubSub: ChatRoomChannel } }
) => {
  verifyCanSendMessage()

  const user = context.currentUser
  const newChatMessage: ChatMessage = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    userId: user.id,
    user,
  }

  chatWorker.loadNewMessageToBuffer(newChatMessage)

  subContext.pubSub.publish('chatRoom', input.streamId, newChatMessage)

  return newChatMessage
}

export const chatMessages: QueryResolvers['chatMessages'] = ({ streamId }) => {
  verifyCanReadMessages()
  return chatWorker.retrieveMessagesFromBuffer(streamId)
}
