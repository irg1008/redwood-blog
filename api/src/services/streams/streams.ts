import { createId } from '@paralleldrive/cuid2'
import { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validate } from '@redwoodjs/api'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import { ForbiddenError, UserInputError } from '@redwoodjs/graphql-server'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export enum StreamEvent {
  PushAuth = 'PUSH_REWRITE',
  Ready = 'STREAM_READY',
  Close = 'STREAM_UNLOAD',
  Shutdown = 'SYSTEM_STOP',
  Boot = 'SYSTEM_START',
  Add = 'STREAM_ADD',
  Remove = 'STREAM_REMOVE',
  View = 'USER_NEW',
  Leave = 'USER_END',
}

type StreamEventData =
  | {
      event: StreamEvent.Close | StreamEvent.Remove
      streamPath: string
    }
  | {
      event: StreamEvent.Shutdown | StreamEvent.Boot
      reason: string
    }
  | {
      event: StreamEvent.Add
      streamPath: string
      config?: unknown
    }
  | {
      event: StreamEvent.View
      streamPath: string
      connectionAddress: string
      connectionId: number
      connector: string
      requestUrl: string
      sessionId: string
    }
  | {
      event: StreamEvent.Leave
      sesionId: string
      streamName: string
      connectionAddress: string
      viewDuration: number
      uploadedBytes: number
      downloadedBytes: number
      tags: string
    }
  | {
      event: StreamEvent.PushAuth
      pushUrl: string
      hostname: string
      streamKey: string
    }
  | {
      event: StreamEvent.Ready
      streamPath: string
      inputType: string
    }

type HandlerOptions<D = StreamEventData> = {
  parseBody: (body: string[]) => D
  validateData?: (data: D) => void
  handle?: (data: D) => Awaited<unknown>
  tap?: (data: D) => void
}

const defaultDataValidator = <D extends StreamEventData>(data: D) => {
  validate(data, {
    presence: {
      message: `Invalid data for ${data.event}`,
    },
  })
}

const defaultHandler = () => true

const createEventHandler =
  <D extends StreamEventData>(options: HandlerOptions<D>) =>
  (plainBody: string) => {
    const {
      parseBody,
      validateData = defaultDataValidator,
      handle = defaultHandler,
      tap,
    } = options

    const bodyData = plainBody.split('\n')

    const data = parseBody(bodyData)
    validateData(data)

    tap?.(data)

    return {
      data,
      handle: () => handle(data),
    }
  }

const readyEventHandler = createEventHandler({
  parseBody(body) {
    const [streamPath, inputType] = body
    return { event: StreamEvent.Ready, streamPath, inputType }
  },
  async tap(data) {
    const { streamPath } = data

    await db.stream.create({
      data: {
        streamer: { connect: { streamPath } },
        streamerLive: { connect: { streamPath } },
      },
    })
  },
})

const closeEventHandler = createEventHandler({
  parseBody(body) {
    const [streamPath] = body
    return { event: StreamEvent.Close, streamPath }
  },
  async tap(data) {
    const { streamPath } = data

    await db.streamer.update({
      where: { streamPath },
      data: {
        liveStream: {
          disconnect: true,
          update: { closedAt: new Date() },
        },
      },
    })
  },
})

const removeEventHandler = createEventHandler({
  parseBody(body) {
    const [streamPath] = body
    return { event: StreamEvent.Remove, streamPath }
  },
})

const shutdownEventHandler = createEventHandler({
  parseBody(body) {
    const [reason] = body
    return { event: StreamEvent.Shutdown, reason }
  },
  async tap() {
    await db.streamer.updateMany({
      data: { liveStreamId: null },
    })
  },
})

const bootEventHandler = createEventHandler({
  parseBody(body) {
    const [reason] = body
    return { event: StreamEvent.Boot, reason }
  },
})

const addEventHandler = createEventHandler({
  parseBody(body) {
    const [streamPath, config] = body
    return {
      event: StreamEvent.Add,
      streamPath,
      config: config ? JSON.parse(config) : undefined,
    }
  },
})

const viewEventHandler = createEventHandler({
  parseBody(body) {
    const [
      streamPath,
      connectionAddress,
      connectionId,
      connector,
      requestUrl,
      sessionId,
    ] = body
    return {
      event: StreamEvent.View,
      streamPath,
      connectionAddress,
      connectionId: parseInt(connectionId),
      connector,
      requestUrl,
      sessionId,
    }
  },
  // TODO: Check other rules for user access:
  // - user must be logged
  // - user must be sub
  // - user must follow for x days
  // - user is not banned
  // - user is not timed out
  // - etc, depending the stream they want to see
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
    return {
      event: StreamEvent.Leave,
      sesionId: sessionId,
      streamName,
      connectionAddress,
      viewDuration: parseInt(viewDuration),
      uploadedBytes: parseInt(uploadedBytes),
      downloadedBytes: parseInt(downloadedBytes),
      tags,
    }
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

    // If all correct allow to publish on streamer path.
    return streamPath
  },
})

const getHandlerForEvent = (event: StreamEvent) => {
  switch (event) {
    case StreamEvent.Ready:
      return readyEventHandler
    case StreamEvent.Close:
      return closeEventHandler
    case StreamEvent.Remove:
      return removeEventHandler
    case StreamEvent.Shutdown:
      return shutdownEventHandler
    case StreamEvent.Boot:
      return bootEventHandler
    case StreamEvent.Add:
      return addEventHandler
    case StreamEvent.View:
      return viewEventHandler
    case StreamEvent.Leave:
      return leaveEventHandler
    case StreamEvent.PushAuth:
      return pushAuthEventHandler
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

export const readStream: QueryResolvers['readStream'] = async ({
  streamId,
}) => {
  const streamer = await db.streamer.findFirst({
    where: { liveStreamId: streamId },
  })

  validate(streamer, {
    presence: { message: 'Streamer is not live' },
  })

  return {
    streamUrl: `${process.env.MEDIA_SERVER_HTTPS_URL}/cmaf/${streamer.streamPath}/index.m3u8`,
  }
}
