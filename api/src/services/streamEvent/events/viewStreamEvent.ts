import { Stream, User } from 'types/graphql'

import { validate } from '@redwoodjs/api'
import { ValidationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import { verifyJwt } from 'src/lib/jwt'
import {
  StreamConnector,
  validateStreamConnector,
} from 'src/lib/stream/streamConnector'
import {
  createEventHandler,
  StreamEvent,
} from 'src/lib/stream/streamEventHandler'
import { parseStreamName, validateStreamName } from 'src/lib/stream/streamName'

const validateIpAddress = (ip: string, ...validIps: string[]) => {
  if (process.env.NODE_ENV !== 'production')
    validIps.push('localhost', '127.0.0.1')

  validate(ip, {
    inclusion: {
      in: validIps,
      message: `Invalid IP. Must be one of ${validIps.join(', ')}`,
    },
  })
}

export const validateUserCanViewStream = async (
  _recordingId: Stream['recordingId'],
  _userId?: User['id']
) => {
  // TODO: Check other rules for user access:
  // - user must be logged
  // - user must be sub
  // - user must follow for x days
  // - user is not banned
  // - user is not timed out
  // - etc, depending the stream they want to see
  // Increment viewers count
}

export const viewEventHandler = createEventHandler({
  async parseBody(body) {
    const [streamName, connectionAddress, sessionId, connector, requestUrl] =
      body

    validateStreamName(streamName)
    validateStreamConnector(connector)

    const url = new URL(requestUrl)
    const jwt = url.searchParams.get('jwt')
    if (!jwt) throw new ValidationError('JWT is required')

    const { payload } = await verifyJwt<{ userId: number; ip: string }>(jwt)
    validateIpAddress(payload.ip, connectionAddress)

    return {
      event: StreamEvent.View,
      streamName,
      connectionAddress,
      sessionId: parseInt(sessionId),
      connector,
      requestUrl,
      ...payload,
    }
  },
  async tap(data) {
    const { streamName, connector } = data
    const { recordingId } = parseStreamName(streamName)

    if (connector !== StreamConnector.HLS) return // Do not register views for thumbnails

    await db.stream.updateMany({
      where: { recordingId },
      data: {
        currentViewers: { increment: 1 },
      },
    })
  },
  async handle(data) {
    const { userId, streamName } = data

    const { recordingId } = parseStreamName(streamName)
    validateUserCanViewStream(recordingId, userId)

    return true
  },
})
