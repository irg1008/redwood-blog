import { createId } from '@paralleldrive/cuid2'
import { Stream as DBStream, StreamState } from '@prisma/client'
import {
  MutationResolvers,
  QueryResolvers,
  StreamRelationResolvers,
  User,
} from 'types/graphql'

import { validate } from '@redwoodjs/api'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import { ForbiddenError, UserInputError } from '@redwoodjs/graphql-server'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { signJwt, verifyJwt } from 'src/lib/jwt'
import {
  createEventHandler,
  StreamEvent,
} from 'src/lib/stream/streamEventHandler'
import {
  createStreamName,
  parseStreamName,
  StreamType,
  validateStreamName,
} from 'src/lib/stream/streamName'

import {
  persistAndDeleteAllMessagesCache,
  persistAndDeleteMessagesCache,
} from '../chatRoom/chatRoom.cache'

const closeEventHandler = createEventHandler({
  parseBody(body) {
    const [streamName] = body
    validateStreamName(streamName)
    return { event: StreamEvent.Close, streamName }
  },
  async tap(data) {
    const { streamName } = data
    const { recordingId } = parseStreamName(streamName)

    const stream = await db.stream.update({
      where: { recordingId },
      data: {
        closedAt: new Date(),
        streamerLive: { disconnect: true },
      },
    })

    await persistAndDeleteMessagesCache(stream.id)
  },
})

const shutdownEventHandler = createEventHandler({
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

const bootEventHandler = createEventHandler({
  parseBody(body) {
    const [reason] = body
    return { event: StreamEvent.Boot, reason }
  },
})

const viewEventHandler = createEventHandler({
  parseBody(body) {
    const [
      streamName,
      connectionAddress,
      connectionId,
      connector,
      requestUrl,
      sessionId,
    ] = body

    validateStreamName(streamName)

    const url = new URL(requestUrl)
    const jwt = url.searchParams.get('jwt')

    return {
      event: StreamEvent.View,
      streamName,
      connectionAddress,
      connectionId: parseInt(connectionId),
      connector,
      requestUrl,
      sessionId,
      jwt,
    }
  },
  async handle(data) {
    const { jwt, streamName, connectionAddress } = data
    if (!jwt) throw new ForbiddenError('JWT is required')

    const { payload } = await verifyJwt<{ userId: number; ip: string }>(jwt)
    validateIpAddress(payload.ip, connectionAddress)

    const { recordingId } = parseStreamName(streamName)
    validateUserCanViewStream(recordingId, payload.userId)

    return true
  },
  async tap(data) {
    const { streamName } = data
    const { recordingId, type } = parseStreamName(streamName)

    const fieldToUpdate: keyof DBStream =
      type === StreamType.Live ? 'currentViewers' : 'totalViews'

    await db.stream.updateMany({
      where: { recordingId },
      data: {
        [fieldToUpdate]: { increment: 1 },
      },
    })
  },
})

const leaveEventHandler = createEventHandler({
  parseBody(body) {
    const [
      sessionId,
      streamName,
      connectionAddress,
      viewDuration,
      uploadedBytes,
      downloadedBytes,
      tags,
    ] = body

    validateStreamName(streamName)

    return {
      event: StreamEvent.Leave,
      sessionId,
      streamName,
      connectionAddress,
      viewDuration: parseInt(viewDuration),
      uploadedBytes: parseInt(uploadedBytes),
      downloadedBytes: parseInt(downloadedBytes),
      tags,
    }
  },

  async tap(data) {
    const { streamName } = data
    const { recordingId, type } = parseStreamName(streamName)

    if (type !== StreamType.Live) return

    await db.stream.updateMany({
      where: { recordingId },
      data: {
        currentViewers: { decrement: 1 },
      },
    })
  },
})

const readyEventHandler = createEventHandler({
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

const pushAuthEventHandler = createEventHandler({
  parseBody(body) {
    const [pushUrl, hostname, streamKey] = body
    const fallbackStreamKey = pushUrl.split('/').pop()

    return {
      event: StreamEvent.PushAuth,
      pushUrl,
      hostname,
      streamKey: streamKey || fallbackStreamKey,
    }
  },
  async handle(data) {
    const { streamKey } = data

    validate(streamKey, {
      presence: {
        message: 'Stream key is required',
      },
      format: {
        pattern: /^stream_[a-zA-Z0-9]+_[a-zA-Z0-9]+$/,
        message:
          'Invalid stream key. Should be stream_<streamPath>_<singleUseSecret>',
      },
    })

    const [, streamPath, secret] = streamKey.split('_')

    const streamer = await db.streamer.findFirst({
      where: { streamPath },
    })

    if (!streamer) {
      throw new UserInputError('Streamer not found')
    }

    const [hashedSecret] = hashPassword(secret, {
      salt: streamPath,
    })

    if (streamer.hashedStreamSecret !== hashedSecret) {
      throw new ForbiddenError('Invalid stream key')
    }

    if (streamer.liveStreamId) {
      throw new ForbiddenError('Streamer is already live')
    }

    if (streamer.banned) {
      throw new ForbiddenError('Streamer access is denied. Reason: Banned')
    }

    const timeoutIsActive = streamer.timeout > new Date()
    if (timeoutIsActive) {
      throw new ForbiddenError(
        `Streamer access is denied. Reason: Timeout until ${streamer.timeout.toLocaleString()}`
      )
    }

    return createStreamName({
      type: StreamType.Live,
      streamPath,
      recordingId: createId(),
    })
  },
})

function validateStreamState(state: string): asserts state is StreamState {
  const validStates = Object.values(StreamState)
  validate(state, {
    inclusion: {
      in: validStates,
      message: `Invalid state. Must be one of ${validStates.join(', ')}`,
    },
  })
}

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

const streamStateEventHandler = createEventHandler({
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
    const { recordingId } = parseStreamName(streamName)

    await db.stream.update({
      where: { recordingId },
      data: { state },
    })
  },
})

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
      return streamStateEventHandler
    default:
      throw new Error(`No handler for event ${event}`)
  }
}

function validateEvent(event: string): asserts event is StreamEvent {
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

export const handleStreamEvent = (streamEvent: string, plainData: string) => {
  validateEvent(streamEvent)
  const handler = getHandlerForEvent(streamEvent)
  return handler(plainData).handle()
}

const validateUserCanViewStream = async (
  _recordingId: DBStream['recordingId'],
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

const createStreamKeyForUser: MutationResolvers['adminCreateStreamKey'] =
  async ({ input }) => {
    const { streamPath, liveStreamId } = await db.streamer.upsert({
      where: input,
      create: input,
      update: {},
    })

    validate(liveStreamId, {
      absence: { message: 'Stop the streaming to renew stream key' },
    })

    const secret = createId()
    const [hashedStreamSecret] = hashPassword(secret, { salt: streamPath })

    await db.streamer.update({
      where: input,
      data: { hashedStreamSecret },
    })

    return { streamKey: `stream_${streamPath}_${secret}` }
  }

export const adminCreateStreamKey: MutationResolvers['adminCreateStreamKey'] =
  async (data) => {
    requireAuth({ roles: 'admin' })
    return createStreamKeyForUser(data)
  }

export const createStreamKey: MutationResolvers['createStreamKey'] =
  async () => {
    requireAuth()
    return createStreamKeyForUser({
      input: { userId: context.currentUser.id },
    })
  }

export const readStream: QueryResolvers['readStream'] = async (
  { streamId },
  { context: { event } }
) => {
  const stream = await db.stream.findUnique({
    where: { id: streamId },
    include: {
      streamer: {
        select: {
          streamPath: true,
          liveStreamId: true,
        },
      },
    },
  })

  validate(stream, {
    presence: {
      message: 'Stream not found',
    },
  })

  validateUserCanViewStream(stream.recordingId, context.currentUser?.id)

  const isLive =
    stream.streamer.liveStreamId === streamId &&
    stream.closedAt === null &&
    stream.state !== StreamState.empty

  const streamName = createStreamName({
    recordingId: stream.recordingId,
    streamPath: stream.streamer.streamPath,
    type: isLive ? StreamType.Live : StreamType.Recording,
  })

  const encodedName = encodeURIComponent(streamName)

  const userJwt = await signJwt(
    {
      ip: event.requestContext.identity.sourceIp,
      userId: context.currentUser?.id,
    },
    (s) => s.setExpirationTime('30s')
  )

  return {
    streamUrl: `${process.env.MEDIA_SERVER_HTTPS_URL}/cmaf/${encodedName}/index.m3u8?jwt=${userJwt}`,
    thumbnailUrl: `${process.env.MEDIA_SERVER_HTTPS_URL}/${encodedName}.mjpg`,
  }
}

export const Stream: StreamRelationResolvers = {
  streamer: (_obj, { root }) => {
    return db.stream.findUnique({ where: { id: root?.id } }).streamer()
  },
  streamerLive: (_obj, { root }) => {
    return db.stream.findUnique({ where: { id: root?.id } }).streamerLive()
  },
}
