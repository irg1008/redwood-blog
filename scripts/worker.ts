import { tasks } from 'api/src/tasks/tasks'
import { Logger, run } from 'graphile-worker'
import pinoLogger from 'pino'

const logger = pinoLogger()

const loggerAdapter = new Logger((scope) => {
  return (level, message, meta) => {
    const scopedLog = logger.child({ scope: scope.taskIdentifier })

    const logFns = {
      debug: scopedLog.debug,
      info: scopedLog.info,
      warning: scopedLog.warn,
      error: scopedLog.error,
    }

    const logFn = logFns[level] || logger.info
    logFn.call(logger, message, meta)
  }
})

const connectionString =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL

const startWorker = async () => {
  const runner = await run({
    connectionString,
    concurrency: 50,
    noHandleSignals: false,
    pollInterval: 1000,
    logger: loggerAdapter,
    taskList: tasks,
  })

  await runner.promise
}

export default async () => {
  await startWorker()
}
