import {
  createEventHandler,
  StreamEvent,
} from 'src/lib/stream/streamEventHandler'

export const bootEventHandler = createEventHandler({
  parseBody(body) {
    const [reason] = body
    return { event: StreamEvent.Boot, reason }
  },
})
