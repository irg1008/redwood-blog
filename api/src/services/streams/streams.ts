import { createId } from '@paralleldrive/cuid2'
import { Stream, Streamer } from '@prisma/client'
import { MutationResolvers, StreamToken } from 'types/graphql'

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

type StreamInput = {
  streamPath: string
}

type EventInput = StreamInput & Pick<Stream, 'connectionId'>

export const streamer = ({ id }: Pick<Streamer, 'id'>) => {
  return db.streamer.findUnique({
    where: { id },
  })
}

const findStreamer = ({ streamPath }: Pick<Streamer, 'streamPath'>) => {
  return db.streamer.findUnique({
    where: { streamPath },
  })
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

  const streamer = await findStreamer({ streamPath })
  if (!streamer) {
    throw new UserInputError('Streamer not found')
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

  const [hashedStreamKey] = hashPassword(streamKey, {
    salt: streamPath,
  })
  if (streamer.hashedStreamKey !== hashedStreamKey) {
    throw new ForbiddenError('Invalid stream key')
  }

  const publishJwtClaim = createPublishStreamClaim(streamer)
  const publishJwtToken = await signJwt(publishJwtClaim, (s) =>
    // It's just a transient token, so we can set a short expiration time.
    s.setExpirationTime('1m')
  )

  return [streamPath, publishJwtToken]
}

export const readStream = async ({ streamPath }: StreamInput) => {
  const streamer = await findStreamer({ streamPath })
  if (!streamer) {
    throw new UserInputError('Streamer not found')
  }

  validate(streamer.live, {
    acceptance: {
      in: [true],
      message: 'Streamer is not live',
    },
  })

  // Future: Check other rules for user access:
  // - user must be logged
  // - user must be sub
  // - user must follow for x days
  // - user is not banned
  // - user is not timed out
  // - etc

  const readJwtClaim = createReadStreamClaim(streamer)
  const readJwtToken = await signJwt(readJwtClaim, (s) =>
    // TODO: Set here the same or little more of the pull time for the client.
    // This is a security measure to make sregular checks on user watching stream.
    // When the user is banned for example, in the front end the token will be removed, but if for some reason the users still saved it, he can reconnect. This prevents the user from using that token for a long time.
    // TODO: This works but it doesn't kick the user when token expires. I think this is good to prevent user disconnecting, but we should kick if token revalidation is not valid. Think about this
    s.setExpirationTime('10m')
  )

  // TODO: We could return here the url depending on the graphql type of request. We could use a union type to return the url or the token depending on protocol.

  return [streamPath, readJwtToken]
}

export const publishStreamEvent = async ({
  streamPath,
  connectionId,
}: EventInput) => {
  await db.$transaction(async (db) => {
    const streamer = await db.streamer.update({
      where: { streamPath },
      data: { live: true },
    })

    await db.stream.upsert({
      where: { connectionId },
      update: {},
      create: {
        streamerId: streamer.id,
        connectionId,
      },
    })
  })
}

export const closeStreamEvent = async ({
  streamPath,
  connectionId,
}: EventInput) => {
  await db.$transaction(async (db) => {
    await db.streamer.update({
      where: { streamPath },
      data: { live: false },
    })

    await db.stream.update({
      data: { closedAt: new Date() },
      where: { connectionId },
    })
  })
}

const createStreamTokenForUser: MutationResolvers['adminCreateStreamToken'] =
  async ({ input }) => {
    const { streamPath } = await db.streamer.upsert({
      where: input,
      create: input,
      update: {},
    })

    const streamKey = createId()
    const [hashedStreamKey] = hashPassword(streamKey, { salt: streamPath })

    await db.streamer.update({
      where: input,
      data: { hashedStreamKey },
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
