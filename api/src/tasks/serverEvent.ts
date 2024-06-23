import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import type { Task as GraphileTask } from 'graphile-worker'
import { SendServerEventInput, ServerEventResult, User } from 'types/graphql'
import { CustomTask, Task, TaskPayload } from 'types/tasks'

import { signPayload } from '@redwoodjs/api/webhooks'

const link = createHttpLink({
  uri: `http://0.0.0.0:${process.env.API_PORT}/graphql`,
})

const authLink = setContext((req, { headers }) => {
  const workerSingnature = signPayload('timestampSchemeVerifier', {
    payload: JSON.stringify(req.variables),
    secret: process.env.WORKER_SECRET,
    options: {
      signatureHeader: process.env.WORKER_SIGNATURE,
    },
  })

  return {
    headers: {
      ...headers,
      [process.env.WORKER_SIGNATURE]: workerSingnature,
    },
  }
})

const apolloClient = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
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
