import { ServerEvent, User } from 'types/graphql'

import { ForbiddenError } from '@redwoodjs/graphql-server'
import { PubSub } from '@redwoodjs/realtime'

import { hasRole } from 'src/lib/auth'

export const schema = gql`
  type Subscription {
    serverEvent(userId: Int!): ServerEvent! @requireAuth
  }
`

export type ServerEventChannel = PubSub<{
  serverEvent: [User['id'], ServerEvent]
}>

const verifySubAccess = (useId: User['id']) => {
  if (hasRole('admin')) return

  if (useId !== context.currentUser?.id)
    throw new ForbiddenError("You can't subscribe to another user's events")
}

export const serverEvent = {
  serverEvent: {
    subscribe: (
      _: unknown,
      { userId }: { userId: User['id'] },
      { pubSub }: { pubSub: ServerEventChannel }
    ) => {
      verifySubAccess(userId)
      return pubSub.subscribe('serverEvent', userId)
    },
    resolve: (payload: ServerEvent) => payload,
  },
}
