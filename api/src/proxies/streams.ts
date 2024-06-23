import replyFrom from '@fastify/reply-from'
import { FastifyInstance } from 'fastify'

import { publishStream } from 'src/services/streams/streams'

export const registerStreamsProxy = async (server: FastifyInstance) => {
  server.addContentTypeParser(
    'application/sdp',
    { parseAs: 'string' },
    (_req, body, done) => done(null, body)
  )

  await server.register(replyFrom, {
    base: process.env.MEDIA_SERVER_WHIP_URL,
    disableRequestLogging: true,
    prefix: '/stream',
  })

  server.post('/stream', async (req, reply) => {
    const token = req.headers.authorization?.split('Bearer ')[1]
    if (!token) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }

    const [streamPath, publishToken] = await publishStream({
      streamToken: token,
    })

    req.headers.authorization = `Bearer ${publishToken}`

    return reply.from(`${streamPath}/whip`)
  })
}
