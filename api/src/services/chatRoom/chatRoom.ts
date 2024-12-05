import { createId } from '@paralleldrive/cuid2'
import {
  ChatMessage,
  ChatMessageInput,
  MutationsendChatMessageArgs,
} from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { ChatRoomContext } from 'src/subscriptions/chatRoom/chatRoom'

import { getLastMessagesFromCache, saveMessagesToCache } from './chatRoom.cache'

export const verifyCanSendMessage = () => {
  return requireAuth()

  // Maybe user needs to "like" the room before sending message
  // Maybe user needs to "follow" room for X days before sending message
}

export const verifyCanReadMessages = () => {
  // For the moment anyone can read messages
  // But maybe we restrict acess for logged in users only
}

export const sendChatMessage = async (
  { input }: MutationsendChatMessageArgs,
  { context: { pubSub } }: { context: ChatRoomContext }
) => {
  const user = verifyCanSendMessage()

  const newChatMessage: ChatMessage = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString(),
    userId: user.id,
    user,
  }

  // Send message to all subscribers
  pubSub.publish('chatRoom', input.streamId, newChatMessage)

  // Save message to KV store
  await saveMessagesToCache(input.streamId, [newChatMessage])

  return newChatMessage
}

export const chatMessages = ({ streamId }: ChatMessageInput) => {
  verifyCanReadMessages()
  return getLastMessagesFromCache(streamId)
}
