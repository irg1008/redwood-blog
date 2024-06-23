import { createServer } from '@redwoodjs/api-server'

import { logger } from 'src/lib/logger'
import { registerStreamsProxy } from 'src/proxies/streams'

async function main() {
  const server = await createServer({
    logger,
    fastifyServerOptions: {
      requestTimeout: 30_000,
    },
    configureApiServer: registerStreamsProxy,
  })

  await server.start()
}

main()
