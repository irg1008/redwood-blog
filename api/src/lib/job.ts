import { WorkerUtilsOptions, quickAddJob } from 'graphile-worker'

type JobParams = Parameters<typeof quickAddJob>
type Args = JobParams extends [WorkerUtilsOptions, ...infer U] ? U : never

const options: WorkerUtilsOptions = {
  connectionString:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
}

export const job = (...args: Args) => quickAddJob(options, ...args)
