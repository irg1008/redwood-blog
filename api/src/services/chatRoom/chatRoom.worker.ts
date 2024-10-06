import path from 'node:path'

import { ChatMessage } from 'types/graphql'
import workerpool, { pool } from 'workerpool'

import { db } from 'src/lib/db'

export const chatRooms = new Map<
  ChatMessage['streamId'],
  {
    persistThreshold: number
    messages: ChatMessage[]
  }
>()

const MAX_CHAT_BUFFER_SIZE = 200

// TODO: Implement persist on room close or when some time without message has pass?
// Also when does the worker dissapears

const persistMessages = (messages: ChatMessage[]) => {
  console.log('Persisting messages', messages)
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

const workerMethods = {
  loadNewMessageToBuffer,
  retrieveMessagesFromBuffer,
}

type WorkerMethods = typeof workerMethods

workerpool.worker(workerMethods)

const startWorkerPool = () => {
  const workerFile = path.basename(__filename)
  return pool(path.join(__dirname, workerFile))
}

const chatWorkerManager = () => {
  const chatWorkerPool = startWorkerPool()

  return new Proxy(workerMethods, {
    get: (_: WorkerMethods, method: keyof WorkerMethods) => {
      return (...args: Parameters<WorkerMethods[typeof method]>) =>
        chatWorkerPool.exec(method, args)
    },
  })
}

export const chatWorker = chatWorkerManager()
