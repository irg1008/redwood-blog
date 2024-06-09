import type {
  MutationsendServerEventArgs,
  SendServerEventInput,
} from 'types/graphql'

import { ServerEventChannel } from 'src/subscriptions/serverEvent/serverEvent'

export const getRoomIdForServerEvent = (input: SendServerEventInput) =>
  `${input.userId}:${input.topic}`

export const sendServerEvent = async (
  { input }: MutationsendServerEventArgs,
  { context: subContext }: { context: { pubSub: ServerEventChannel } }
) => {
  subContext.pubSub.publish(
    'serverEvent',
    getRoomIdForServerEvent(input),
    input
  )
  return input
}
