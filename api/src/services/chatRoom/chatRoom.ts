import { randomUUID } from 'crypto'
import path from 'node:path'

import { ChatMessage, QueryResolvers } from 'types/graphql'
import { pool } from 'workerpool'

import { requireAuth } from 'src/lib/auth'
import { ChatRoomChannel } from 'src/subscriptions/chatRoom/chatRoom'

import { ChatWorker } from './chatRoom.worker'

const chatWorkerPool = pool(path.join(__dirname, 'chatRoom.worker.js'))

export const verifyCanSendChatMessage = () => {
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
  verifyCanSendChatMessage()

  const user = context.currentUser
  const newChatMessage: ChatMessage = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    userId: user.id,
    user,
  }

  chatWorkerPool
    .proxy<ChatWorker>()
    .then((worker) => worker.loadNewMessageToBuffer(newChatMessage))

  subContext.pubSub.publish('chatRoom', input.streamId, newChatMessage)

  return newChatMessage
}

export const chatMessages: QueryResolvers['chatMessages'] = async ({
  streamId,
}) => {
  verifyCanReadMessages()

  return await chatWorkerPool
    .proxy<ChatWorker>()
    .then((worker) => worker.retrieveMessagesFromBuffer(streamId))
}
