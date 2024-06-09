import type { MutationsendServerEventArgs } from 'types/graphql'

import { ServerEventChannel } from 'src/subscriptions/serverEvent/serverEvent'

export const sendServerEvent = async (
  { input }: MutationsendServerEventArgs,
  { context: subContext }: { context: { pubSub: ServerEventChannel } }
) => {
  subContext.pubSub.publish('serverEvent', input.userId, input)
  return input
}
