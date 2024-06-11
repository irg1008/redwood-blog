import type { SendServerEventInput, ServerEventInput } from 'types/graphql'

import { ServerEventChannel } from 'src/subscriptions/serverEvent/serverEvent'

export const getRoomIdForServerEvent = (input: ServerEventInput) =>
  `${input.userId}:${input.topic}`

export const sendServerEvent = async (
  { input }: { input: SendServerEventInput },
  { context: subContext }: { context: { pubSub: ServerEventChannel } }
) => {
  subContext.pubSub.publish(
    'serverEvent',
    getRoomIdForServerEvent(input),
    input
  )
  return input
}
