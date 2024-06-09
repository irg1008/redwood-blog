import { createServer } from '@redwoodjs/api-server'

import { logger } from 'src/lib/logger'

async function main() {
  const server = await createServer({
    logger,
    fastifyServerOptions: {
      requestTimeout: 30_000,
    },
  })

  await server.start()
}

main()
