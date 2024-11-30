import { StreamState } from '@prisma/client'

import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import {
  createEventHandler,
  StreamEvent,
} from 'src/lib/stream/streamEventHandler'
import { parseStreamName, validateStreamName } from 'src/lib/stream/streamName'

function validateStreamState(state: string): asserts state is StreamState {
  const validStates = Object.values(StreamState)
  validate(state, {
    inclusion: {
      in: ['', ...validStates],
      message: `Invalid state. Must be one of ${validStates.join(', ')}. Received is "${state}`,
    },
  })
}

export const stateEventHandler = createEventHandler({
  parseBody(body) {
    const [streamName, state, healthInfo] = body

    validateStreamName(streamName)

    const validState = state.toLowerCase()
    validateStreamState(validState)

    return {
      event: StreamEvent.StateChange,
      streamName,
      state: validState,
      healthInfo: healthInfo && JSON.parse(healthInfo),
    }
  },
  async tap({ streamName, state }) {
    if (!state) return

    const { recordingId } = parseStreamName(streamName)

    await db.stream.update({
      where: { recordingId },
      data: { state },
    })
  },
})
