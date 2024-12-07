import { ChatMessage } from 'types/graphql'

import { db } from 'src/lib/db'
import { KV } from 'src/lib/kv'

const MESSAGE_RETRIEVE_LIMIT = 500
const OFFLOAD_SAVE_THRESHOLD = 200 // We save on <OFFLOAD_SAVE_THRESHOLD> messages over <MESSAGE_RETRIEVE_LIMIT>

export const getKeyForStream = (streamId: number) => `stream:${streamId}`

export const parseStreamMessages = (
  messages: [id: string, fields: string[]][]
): ChatMessage[] => {
  return messages.map(([_key, [_messageId, message]]) => JSON.parse(message))
}

export const saveMessagesToCache = async (
  streamId: number,
  messages: ChatMessage[]
) => {
  const streamKey = getKeyForStream(streamId)

  const messagesToSave = messages.map((message) => [
    message.id,
    JSON.stringify(message),
  ])

  await KV.xadd(streamKey, '*', ...messagesToSave.flat())

  // Check for stream size and offload to SQL
  persistsAndOffloadMessagesCache(streamId)
}

export const getLastMessagesFromCache = async (
  streamId: number,
  count: number = MESSAGE_RETRIEVE_LIMIT
) => {
  const messages = await KV.xrevrange(
    getKeyForStream(streamId),
    '+',
    '-',
    'COUNT',
    count
  )

  return parseStreamMessages(messages).toReversed()
}

export const getFirstMessagesFromCache = async (
  streamId: number,
  count: number = MESSAGE_RETRIEVE_LIMIT
) => {
  const messages = await KV.xrange(
    getKeyForStream(streamId),
    '-',
    '+',
    'COUNT',
    count
  )

  return parseStreamMessages(messages)
}

export const trimMessagesCache = (streamId: number, count: number) => {
  // With "~" we are saying we don't care for exact trimming since 500 and 505 messages are almost the same
  return KV.xtrim(getKeyForStream(streamId), 'MAXLEN', '~', count)
}

export const cleanMessagesCache = (streamId: number) => {
  return KV.del(getKeyForStream(streamId))
}

export const getMessagesCacheLength = (streamId: number) => {
  return KV.xlen(getKeyForStream(streamId))
}

export const persistChatMessages = async (messages: ChatMessage[]) => {
  const data = messages.map((message) => {
    const { user: _, ...messageData } = message
    return messageData
  })

  await db.streamMessage.createMany({ data, skipDuplicates: true })
}

export const persistsAndOffloadMessagesCache = async (streamId: number) => {
  const streamLength = await getMessagesCacheLength(streamId)

  const messagesOverLimit = streamLength - MESSAGE_RETRIEVE_LIMIT
  const hasReachedThreshold = messagesOverLimit >= OFFLOAD_SAVE_THRESHOLD

  if (hasReachedThreshold) {
    const messagesToSave = await getFirstMessagesFromCache(
      streamId,
      messagesOverLimit
    )

    await persistChatMessages(messagesToSave)
    await trimMessagesCache(streamId, MESSAGE_RETRIEVE_LIMIT)
  }
}

export const persistAndDeleteMessagesCache = async (streamId: number) => {
  const allMessages = MESSAGE_RETRIEVE_LIMIT + OFFLOAD_SAVE_THRESHOLD

  const messages = await getFirstMessagesFromCache(streamId, allMessages)

  await persistChatMessages(messages)
  await cleanMessagesCache(streamId)
}

export const persistAndDeleteAllMessagesCache = async () => {
  const streamKeys = await KV.keys('stream:*')

  for (const streamKey of streamKeys) {
    const streamId = Number(streamKey.split(':')[1])
    await persistAndDeleteMessagesCache(streamId)
  }
}
