import { db } from 'src/lib/db'
import {
  StreamConnector,
  validateStreamConnector,
} from 'src/lib/stream/streamConnector'
import {
  createEventHandler,
  StreamEvent,
} from 'src/lib/stream/streamEventHandler'
import {
  parseStreamName,
  StreamType,
  validateStreamName,
} from 'src/lib/stream/streamName'

export const leaveEventHandler = createEventHandler({
  parseBody(body) {
    const [
      sessionId,
      streamName,
      connector,
      connectionAddress,
      viewDuration,
      uploadedBytes,
      downloadedBytes,
      tags,
    ] = body

    validateStreamName(streamName)
    validateStreamConnector(connector)

    return {
      event: StreamEvent.Leave,
      sessionId: parseInt(sessionId),
      streamName,
      connector,
      connectionAddress,
      viewDuration: parseInt(viewDuration),
      uploadedBytes: parseInt(uploadedBytes),
      downloadedBytes: parseInt(downloadedBytes),
      tags,
    }
  },
  async tap(data) {
    const { streamName, connector } = data
    const { recordingId, type } = parseStreamName(streamName)

    if (type !== StreamType.Live || connector !== StreamConnector.HLS) return

    await db.stream.updateMany({
      where: { recordingId },
      data: {
        currentViewers: { decrement: 1 },
      },
    })
  },
})
