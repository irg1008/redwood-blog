import { validate } from '@redwoodjs/api'

import { StreamEvent } from 'src/lib/stream/streamEventHandler'

import { bootEventHandler } from './events/bootStreamEvent'
import { closeEventHandler } from './events/closeStreamEvent'
import { endEventHandler } from './events/endStreamEvent'
import { leaveEventHandler } from './events/leaveStreamEvent'
import { pushAuthEventHandler } from './events/pushAuthStreamEvent'
import { readyEventHandler } from './events/readyStreamEvent'
import { shutdownEventHandler } from './events/shutdownStreamEvent'
import { stateEventHandler } from './events/stateStreamEvent'
import { viewEventHandler } from './events/viewStreamEvent'

const getHandlerForEvent = (event: StreamEvent) => {
  switch (event) {
    case StreamEvent.Ready:
      return readyEventHandler
    case StreamEvent.Close:
      return closeEventHandler
    case StreamEvent.Shutdown:
      return shutdownEventHandler
    case StreamEvent.Boot:
      return bootEventHandler
    case StreamEvent.View:
      return viewEventHandler
    case StreamEvent.Leave:
      return leaveEventHandler
    case StreamEvent.PushAuth:
      return pushAuthEventHandler
    case StreamEvent.StateChange:
      return stateEventHandler
    case StreamEvent.End:
      return endEventHandler
    default:
      throw new Error(`No handler for event ${event}`)
  }
}

function validateEvent(
  event: string | undefined
): asserts event is StreamEvent {
  const validStreamEvents = Object.values(StreamEvent)

  validate(event, {
    presence: {
      message: 'Event is required',
    },
    inclusion: {
      in: validStreamEvents,
      message: `Event must one of ${validStreamEvents.join(', ')}`,
    },
  })
}

export const handleStreamEvent = async (
  streamEvent: string | undefined,
  plainData: string
) => {
  validateEvent(streamEvent)
  return await getHandlerForEvent(streamEvent).handle(plainData)
}
