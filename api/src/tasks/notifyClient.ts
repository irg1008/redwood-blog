import { ApolloClient, InMemoryCache } from '@apollo/client'
import type { Task as GraphileTask } from 'graphile-worker'
import { SendServerEventInput, ServerEventResult, User } from 'types/graphql'
import { CustomTask, Task, TaskPayload } from 'types/tasks'

const apolloClient = new ApolloClient({
  uri: `${process.env.WEB_URI}/api/graphql`,
  cache: new InMemoryCache(),
  headers: { Authorization: `Bearer ${process.env.WORKER_SECRET}` },
})

const SEND_SERVER_EVENT = gql`
  mutation SendServerEvent($input: SendServerEventInput!) {
    sendServerEvent(input: $input) {
      message
      topic
    }
  }
`

export const notifyClient = async (
  userId: User['id'],
  topic: string,
  data: unknown
) => {
  return apolloClient.mutate<
    ServerEventResult,
    { input: SendServerEventInput }
  >({
    mutation: SEND_SERVER_EVENT,
    variables: {
      input: {
        topic,
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

    const queueName = await handlers.getQueueName()
    const userId = parseInt(queueName)

    if (Number.isNaN(userId)) {
      return handlers.logger.error(
        `Empty or invalid user ID. Skipping notification.`
      )
    }

    await notifyClient(userId, handlers.job.task_identifier, response)
  }
}
