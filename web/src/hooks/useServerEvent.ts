import { useMemo } from 'react'

import { ServerEvent } from 'types/graphql'
import type { Task, TaskResponse } from 'types/tasks'

import { useSubscription } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

const SERVER_EVENTS_SUB = gql`
  subscription ListenForServerEvents($userId: Int!) {
    serverEvent(userId: $userId) {
      topic
      message
    }
  }
`

// TODO: Add topic to subscribe to specific events the same as with id??. Or maybe we can subscribe to all and filter

export const useServerEvent = <TK extends Task>(): TaskResponse[TK] => {
  const { currentUser } = useAuth()

  const { data } = useSubscription<{
    serverEvent: ServerEvent
  }>(SERVER_EVENTS_SUB, {
    variables: { userId: currentUser?.id },
    skip: !currentUser,
  })

  return useMemo(() => {
    const serverEvent = data?.serverEvent
    return serverEvent?.message ? JSON.parse(serverEvent.message) : null
  }, [data])
}
