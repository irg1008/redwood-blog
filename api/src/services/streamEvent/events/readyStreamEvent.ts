import { db } from 'src/lib/db'
import {
  createEventHandler,
  StreamEvent,
} from 'src/lib/stream/streamEventHandler'
import { parseStreamName, validateStreamName } from 'src/lib/stream/streamName'

export const readyEventHandler = createEventHandler({
  parseBody(body) {
    const [streamName, inputType] = body
    validateStreamName(streamName)
    return { event: StreamEvent.Ready, streamName, inputType }
  },
  async tap(data) {
    const { streamName } = data
    const { streamPath, recordingId } = parseStreamName(streamName)

    await db.stream.create({
      data: {
        recordingId,
        streamer: { connect: { streamPath } },
        streamerLive: { connect: { streamPath } },
      },
    })
  },
})
