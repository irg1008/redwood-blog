import { TaskSpec, WorkerUtilsOptions, quickAddJob } from 'graphile-worker'
import type { Task, TaskPayload } from 'types/tasks'

const DEFAULT_QUEUE = 'default'

const options: WorkerUtilsOptions = {
  connectionString:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
}

export const job = <TK extends Task>(
  taskId: TK,
  payload: TK extends keyof GraphileWorker.Tasks ? TaskPayload[TK] : unknown,
  spec?: TaskSpec
) => {
  return quickAddJob(options, taskId, payload, {
    ...spec,
    queueName: context.currentUser?.id.toString() || DEFAULT_QUEUE,
  })
}
