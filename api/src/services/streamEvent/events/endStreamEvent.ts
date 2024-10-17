import { db } from 'src/lib/db'
import {
  createEventHandler,
  StreamEvent,
} from 'src/lib/stream/streamEventHandler'
import { parseStreamName, validateStreamName } from 'src/lib/stream/streamName'

export const endEventHandler = createEventHandler({
  parseBody(body) {
    const [
      streamName,
      downloadedBytes,
      uploadedBytes,
      totalViews,
      totalInputs,
      totalOutputs,
      totalViewDuration,
    ] = body

    validateStreamName(streamName)

    return {
      event: StreamEvent.End,
      streamName,
      downloadedBytes: parseInt(downloadedBytes),
      uploadedBytes: parseInt(uploadedBytes),
      totalViews: parseInt(totalViews),
      totalInputs: parseInt(totalInputs),
      totalOutputs: parseInt(totalOutputs),
      totalViewDuration: totalViewDuration ? parseInt(totalViewDuration) : 0,
    }
  },
  async tap(data) {
    const { streamName, totalViews } = data
    const { recordingId } = parseStreamName(streamName)

    await db.stream.updateMany({
      where: { recordingId },
      data: { totalViews },
    })
  },
})
