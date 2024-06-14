import { ChatMessage } from 'types/graphql'
import workerpool from 'workerpool'

import { db } from 'src/lib/db'

export const chatRooms = new Map<
  ChatMessage['streamId'],
  {
    persistThreshold: number
    messages: ChatMessage[]
  }
>()

const MAX_CHAT_BUFFER_SIZE = 20

// TODO: Implement persist on room close?

const persistMessages = (messages: ChatMessage[]) => {
  console.log('persisitn messages', messages)
  return db.streamMessage.createMany({
    data: messages,
  })
}

const loadNewMessageToBuffer = (newChatMessage: ChatMessage) => {
  const chatRoom = chatRooms.get(newChatMessage.streamId) || {
    persistThreshold: 0,
    messages: [],
  }

  if (chatRoom.persistThreshold === MAX_CHAT_BUFFER_SIZE) {
    persistMessages(chatRoom.messages)
    chatRoom.persistThreshold = 0
  }

  if (chatRoom.messages.length === MAX_CHAT_BUFFER_SIZE) {
    chatRoom.messages.shift()
  }

  chatRoom.messages.push(newChatMessage)
  chatRoom.persistThreshold++

  chatRooms.set(newChatMessage.streamId, chatRoom)
}

const retrieveMessagesFromBuffer = (streamId: ChatMessage['streamId']) => {
  return chatRooms.get(streamId)?.messages || []
}

export type ChatWorker = {
  loadNewMessageToBuffer: typeof loadNewMessageToBuffer
  retrieveMessagesFromBuffer: typeof retrieveMessagesFromBuffer
}

workerpool.worker({
  loadNewMessageToBuffer,
  retrieveMessagesFromBuffer,
})
