import { createId } from '@paralleldrive/cuid2'
import { Streamer } from '@prisma/client'
import { MutationResolvers, QueryResolvers, StreamToken } from 'types/graphql'

import { validate } from '@redwoodjs/api'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import { ForbiddenError, UserInputError } from '@redwoodjs/graphql-server'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { signJwt } from 'src/lib/jwt'

type MediaServerPermission = {
  action: 'publish' | 'read'
  path: string
}

type MediaServerClaim = {
  mediamtx_permissions: MediaServerPermission[]
}

export type MediaServerEvent = {
  connectionId: string
  streamPath: string
  event: 'publish' | 'close'
}

const createPublishStreamClaim = ({
  streamPath,
}: Streamer): MediaServerClaim => {
  return {
    mediamtx_permissions: [
      {
        action: 'publish',
        path: streamPath,
      },
      {
        action: 'read',
        path: streamPath,
      },
    ],
  }
}

const createReadStreamClaim = ({ streamPath }: Streamer): MediaServerClaim => {
  return {
    mediamtx_permissions: [
      {
        action: 'read',
        path: streamPath,
      },
    ],
  }
}

export const publishStream = async ({ streamToken }: StreamToken) => {
  validate(streamToken, {
    presence: {
      message: 'Stream token is required',
    },
    format: {
      pattern: /^stream_[a-zA-Z0-9]+_[a-zA-Z0-9]+$/,
      message: 'Invalid stream token',
    },
  })

  const [, streamPath, streamKey] = streamToken.split('_')

  const streamer = await db.streamer.findFirst({
    where: { streamPath },
  })

  if (!streamer) {
    throw new UserInputError('Streamer not found')
  }

  const [hashedStreamKey] = hashPassword(streamKey, {
    salt: streamPath,
  })
  if (streamer.hashedStreamKey !== hashedStreamKey) {
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

  const publishJwtClaim = createPublishStreamClaim(streamer)
  const publishJwtToken = await signJwt(publishJwtClaim, (s) =>
    // It's just a transient token, so we can set a short expiration time.
    s.setExpirationTime('30m')
  )

  return [streamPath, publishJwtToken]
}

export const readStream: QueryResolvers['readStream'] = async ({
  streamId,
}) => {
  const streamer = await db.stream
    .findUnique({ where: { id: streamId } })
    .streamer()

  validate(streamer?.liveStreamId, {
    presence: { message: 'Streamer is not live' },
  })

  // Future: Check other rules for user access:
  // - user must be logged
  // - user must be sub
  // - user must follow for x days
  // - user is not banned
  // - user is not timed out
  // - etc

  // TODO: This works but it doesn't kick the user when token expires. I think this is good to prevent user disconnecting, but we should kick if token revalidation is not valid. Think about this

  const readJwtClaim = createReadStreamClaim(streamer)
  const readJwtToken = await signJwt(readJwtClaim, (s) =>
    s.setExpirationTime('10m')
  )

  return {
    streamUrl: `${process.env.MEDIA_SERVER_HLS_URL}/${streamer.streamPath}/index.m3u8?jwt=${readJwtToken}`,
  }
}

export const publishStreamEvent = async ({
  streamPath,
  connectionId,
}: MediaServerEvent) => {
  await db.$transaction(async (db) => {
    const stream = await db.stream.upsert({
      where: { connectionId },
      create: {
        connectionId,
        streamer: { connect: { streamPath } },
      },
      update: { closedAt: null },
    })

    await db.streamer.update({
      where: { id: stream.streamerId },
      data: { liveStreamId: stream.id },
    })
  })
}

export const closeStreamEvent = async ({
  streamPath,
  connectionId,
}: MediaServerEvent) => {
  await db.stream.update({
    data: { closedAt: new Date(), streamerLive: { disconnect: true } },
    where: { connectionId, streamer: { streamPath }, closedAt: null },
  })
}

const createStreamTokenForUser: MutationResolvers['adminCreateStreamToken'] =
  async ({ input }) => {
    const streamPath = createId()
    const streamKey = createId()

    const [hashedStreamKey] = hashPassword(streamKey, { salt: streamPath })

    const streamer = await db.streamer.findFirst({
      where: input,
    })

    validate(streamer?.liveStreamId, {
      absence: { message: 'Stream token creation is not allowed while live' },
    })

    await db.streamer.upsert({
      where: input,
      create: { ...input, streamPath, hashedStreamKey },
      update: { streamPath, hashedStreamKey },
    })

    return { streamToken: `stream_${streamPath}_${streamKey}` }
  }

export const adminCreateStreamToken: MutationResolvers['adminCreateStreamToken'] =
  async (data) => {
    requireAuth({ roles: 'admin' })
    return createStreamTokenForUser(data)
  }

export const createStreamToken: MutationResolvers['createStreamToken'] =
  async () => {
    requireAuth()
    return createStreamTokenForUser({
      input: { userId: context.currentUser.id },
    })
  }
