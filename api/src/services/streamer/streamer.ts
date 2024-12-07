import { createId } from '@paralleldrive/cuid2'
import {
  MutationResolvers,
  QueryResolvers,
  StreamerRelationResolvers,
} from 'types/graphql'

import { validate } from '@redwoodjs/api'
import { hashPassword } from '@redwoodjs/auth-dbauth-api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const streamer: QueryResolvers['streamer'] = ({ id }) => {
  return db.streamer.findUnique({
    where: { id },
  })
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
    const user = requireAuth()
    return createStreamKeyForUser({
      input: { userId: user.id },
    })
  }

export const Streamer: StreamerRelationResolvers = {
  user: (_obj, { root }) => {
    return db.streamer.findUniqueOrThrow({ where: { id: root?.id } }).user()
  },
  liveStream: (_obj, { root }) => {
    return db.streamer.findUnique({ where: { id: root?.id } }).liveStream()
  },
}
