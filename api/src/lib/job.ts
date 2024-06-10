import {
  TaskSpec,
  WorkerUtils,
  WorkerUtilsOptions,
  makeWorkerUtils,
} from 'graphile-worker'
import type { Task, TaskPayload } from 'types/tasks'

const DEFAULT_QUEUE = 'default'

const options: WorkerUtilsOptions = {
  connectionString:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
}

export let workerUtils: WorkerUtils

const startUtilsSingleton = async () => {
  workerUtils = await makeWorkerUtils(options)
}

export const job = async <TK extends Task>(
  taskId: TK,
  payload: TK extends keyof GraphileWorker.Tasks ? TaskPayload[TK] : unknown,
  spec?: TaskSpec
) => {
  if (!workerUtils) await startUtilsSingleton()
  return workerUtils.addJob(taskId, payload, {
    ...spec,
    queueName: context.currentUser?.id.toString() || DEFAULT_QUEUE,
  })
}
