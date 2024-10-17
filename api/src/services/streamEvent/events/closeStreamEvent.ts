import { db } from 'src/lib/db'
import {
  createEventHandler,
  StreamEvent,
} from 'src/lib/stream/streamEventHandler'
import { parseStreamName, validateStreamName } from 'src/lib/stream/streamName'
import { persistAndDeleteMessagesCache } from 'src/services/chatRoom/chatRoom.cache'

export const closeEventHandler = createEventHandler({
  parseBody(body) {
    const [streamName] = body
    validateStreamName(streamName)
    return { event: StreamEvent.Close, streamName }
  },
  async tap(data) {
    const { streamName } = data
    const { recordingId } = parseStreamName(streamName)

    const stream = await db.stream.update({
      where: { recordingId },
      data: {
        closedAt: new Date(),
        streamerLive: { disconnect: true },
      },
    })

    await persistAndDeleteMessagesCache(stream.id)
  },
})
