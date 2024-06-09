import { ApolloClient, InMemoryCache } from '@apollo/client'
import type { Task as GraphileTask, JobHelpers } from 'graphile-worker'
import { MutationsendServerEventArgs, ServerEvent } from 'types/graphql'
import { CustomTask, Task, TaskPayload } from 'types/tasks'

const apolloClient = new ApolloClient({
  uri: `${process.env.WEB_URI}/api/graphql`,
  cache: new InMemoryCache(),
  headers: { Authorization: `Bearer ${process.env.WORKER_SECRET}` },
})

const SEND_EVENT = gql`
  mutation SendEvent($input: ServerEventInput!) {
    sendServerEvent(input: $input) {
      message
      topic
    }
  }
`

export const notifyClient = async (handlers: JobHelpers, data: unknown) => {
  const queueName = await handlers.getQueueName()

  const userId = parseInt(queueName)
  if (Number.isNaN(userId)) {
    return handlers.logger.error(
      `Empty or invalid user ID. Skipping notification.`
    )
  }

  return apolloClient.mutate<ServerEvent, MutationsendServerEventArgs>({
    mutation: SEND_EVENT,
    variables: {
      input: {
        topic: handlers.job.task_identifier,
        userId,
        message: JSON.stringify(data),
      },
    },
  })
}

export const withClientNotification = <TK extends Task>(
  customTask: CustomTask<TK>
): GraphileTask => {
  return async (payload: TaskPayload[TK], handlers) => {
    const response = await customTask(payload, handlers)
    await notifyClient(handlers, response)
  }
}
