import { useMemo } from 'react'

import {
  ListenForServerEvents,
  ListenForServerEventsVariables,
} from 'types/graphql'
import type { Task, TaskResponse } from 'types/tasks'

import { useSubscription } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const SERVER_EVENTS_SUB = gql`
  subscription ListenForServerEvents($input: ServerEventInput!) {
    serverEvent(input: $input) {
      topic
      message
    }
  }
`

export const useServerEvent = <TK extends Task>(
  topic: TK
): TaskResponse[TK] => {
  const { currentUser } = useAuth()

  const { data } = useSubscription<
    ListenForServerEvents,
    ListenForServerEventsVariables
  >(SERVER_EVENTS_SUB, {
    variables: {
      input: {
        userId: currentUser?.id,
        topic,
      },
    },
    skip: !currentUser,
  })

  return useMemo(() => {
    const serverEvent = data?.serverEvent
    return serverEvent?.message ? JSON.parse(serverEvent.message) : null
  }, [data])
}
