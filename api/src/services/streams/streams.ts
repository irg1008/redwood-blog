import { ok } from 'node:assert'

import { StreamState } from '@prisma/client'
import { QueryResolvers, StreamRelationResolvers } from 'types/graphql'

import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { signJwt } from 'src/lib/jwt'
import { createStreamName, StreamType } from 'src/lib/stream/streamName'

import { validateUserCanViewStream } from '../streamEvent/events/viewStreamEvent'

export const getStreamUrl: QueryResolvers['getStreamUrl'] = async (
  { streamId },
  global
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
  ok(stream)

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

  const ip = global?.context.event.requestContext.identity?.sourceIp
  validate(ip, {
    presence: {
      message: 'IP not found',
    },
  })
  ok(ip)

  const userJwt = await signJwt(
    {
      ip,
      userId: context.currentUser?.id,
    },
    (s) => s.setExpirationTime('30s')
  )

  const encodedName = encodeURIComponent(streamName)
  return {
    streamUrl: `${process.env.MEDIA_SERVER_HTTP_URL}/cmaf/${encodedName}/index.m3u8?jwt=${userJwt}`,
    thumbnailUrl: `${process.env.MEDIA_SERVER_HTTP_URL}/${encodedName}.mjpg?jwt=${userJwt}`,
  }
}

export const Stream: StreamRelationResolvers = {
  streamer: (_obj, { root }) => {
    return db.stream.findUniqueOrThrow({ where: { id: root?.id } }).streamer()
  },
  streamerLive: (_obj, { root }) => {
    return db.stream.findUnique({ where: { id: root?.id } }).streamerLive()
  },
}
