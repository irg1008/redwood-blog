import { db } from 'src/lib/db'
import {
  createEventHandler,
  StreamEvent,
} from 'src/lib/stream/streamEventHandler'
import { persistAndDeleteAllMessagesCache } from 'src/services/chatRoom/chatRoom.cache'

export const shutdownEventHandler = createEventHandler({
  parseBody(body) {
    const [reason] = body
    return { event: StreamEvent.Shutdown, reason }
  },
  async tap() {
    await db.streamer.updateMany({
      where: { liveStream: { isNot: null } },
      data: { liveStreamId: null },
    })

    await persistAndDeleteAllMessagesCache()
  },
})
