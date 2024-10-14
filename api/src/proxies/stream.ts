import replyFrom from '@fastify/reply-from'
import { FastifyInstance } from 'fastify'

export const registerStreamsProxy = async (server: FastifyInstance) => {
  await server.register(replyFrom, {
    base: process.env.MEDIA_SERVER_HTTPS_URL,
    disableRequestLogging: true,
    // prefix: '/live',
  })

  server.get('/live/:streamId', async (req, reply) => {
    console.log(req)

    return reply.from(`blabla`)
  })
}
