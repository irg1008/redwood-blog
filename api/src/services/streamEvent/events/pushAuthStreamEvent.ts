import { createId } from '@paralleldrive/cuid2'

import { validate } from '@redwoodjs/api'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import { ForbiddenError, UserInputError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'
import {
  createEventHandler,
  StreamEvent,
} from 'src/lib/stream/streamEventHandler'
import { createStreamName, StreamType } from 'src/lib/stream/streamName'

const validateStreamKey = (streamKey: string) => {
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
}

export const pushAuthEventHandler = createEventHandler({
  parseBody(body) {
    const [pushUrl, hostname, streamKey] = body
    const fallbackStreamKey = pushUrl.split('/').pop()

    return {
      event: StreamEvent.PushAuth,
      pushUrl,
      hostname,
      streamKey: streamKey || fallbackStreamKey || '',
    }
  },
  async handle(data) {
    const { streamKey } = data
    validateStreamKey(streamKey)

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

    if (streamer.timeout && streamer.timeout > new Date()) {
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
