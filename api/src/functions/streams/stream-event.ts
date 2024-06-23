import type { APIGatewayProxyHandler } from 'aws-lambda'

import { validate } from '@redwoodjs/api'
import { verifyEvent } from '@redwoodjs/api/webhooks'

import {
  closeStreamEvent,
  publishStreamEvent,
} from 'src/services/streams/streams'

type Event = 'publish' | 'close'

type StreamEventPayload = {
  connectionId: string
  streamPath: string
  event: Event
}

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: null,
    }
  }

  verifyEvent('timestampSchemeVerifier', {
    event,
    secret: process.env.MEDIA_SERVER_SECRET,
    options: {
      signatureHeader: process.env.MEDIA_SERVER_SIGNATURE,
    },
  })

  try {
    const payload = JSON.parse(event.body)

    validatePayload(payload)
    handleEvent(payload)
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: error.message,
      }),
    }
  }

  return {
    statusCode: 200,
    body: null,
  }
}

const handleEvent = async (payload: StreamEventPayload) => {
  switch (payload.event) {
    case 'publish':
      publishStreamEvent(payload)
      break
    case 'close':
      closeStreamEvent(payload)
      break
  }
}

function validatePayload(
  payload: StreamEventPayload
): asserts payload is StreamEventPayload {
  const { connectionId, streamPath, event } = payload

  validate(streamPath, {
    presence: {
      message: 'Stream path is required',
    },
  })

  validate(connectionId, {
    presence: {
      message: 'Connection id is required',
    },
    format: {
      pattern:
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      message: 'Connection id is not a valid uuid',
    },
  })

  validate(event, {
    presence: {
      message: 'Event is required',
    },
    inclusion: {
      in: ['publish', 'close'] satisfies Event[],
      message: 'Event must be either start or end',
    },
  })
}
