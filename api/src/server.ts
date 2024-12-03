import { createServer } from '@redwoodjs/api-server'

import { registeri18nMiddleware } from 'src/i18n/i18n'
import { logger } from 'src/lib/logger'

async function main() {
  const server = await createServer({
    logger,
    fastifyServerOptions: {
      requestTimeout: 30_000,
    },
  })

  await registeri18nMiddleware(server)
  await server.start()
}

main()
