import type { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'

import { validate } from '@redwoodjs/api'
import { verifyEvent } from '@redwoodjs/api/webhooks'

import { logger } from 'src/lib/logger'
import { handleStreamEvent } from 'src/services/streamEvent/streamEvent'

const verifySource = (event: APIGatewayProxyEvent) => {
  verifyEvent('timestampSchemeVerifier', {
    event,
    secret: process.env.MEDIA_SERVER_SECRET,
    options: {
      signatureHeader: process.env.MEDIA_SERVER_SIGNATURE_HEADER,
      tolerance: 10_000, // 10 seconds
    },
  })
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const streamEvent = event.headers[process.env.MEDIA_SERVER_TRIGGER_HEADER]

  try {
    verifySource(event)

    validate(event.body, {
      presence: {
        message: 'No body provided',
        allowEmptyString: false,
      },
    })

    const response = await handleStreamEvent(streamEvent, event.body)

    return {
      statusCode: response ? 200 : 400,
      body: typeof response === 'string' ? response : JSON.stringify(response),
    }
  } catch (error) {
    logger.error(
      `> Streams: [${streamEvent}] refused. Reason: ${error.message}`
    )
    return {
      statusCode: 400,
      body: JSON.stringify(false),
    }
  }
}
