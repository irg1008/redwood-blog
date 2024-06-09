import { confirmUserSchema, v } from 'schemas/schemas'
import { CustomTask } from 'types/tasks'

import { sendConfirmUserEmail } from 'src/services/mails/mails'

import { withClientNotification } from '../notifyClient'

export const sendConfirmUserEmailTask: CustomTask<
  'send_confirm_user_email'
> = async (payload, handlers) => {
  if (!v.is(confirmUserSchema, payload)) {
    handlers.logger.error('Invalid payload', payload)
    return { success: false }
  }

  await sendConfirmUserEmail(payload)

  return { success: true }
}

export default withClientNotification(sendConfirmUserEmailTask)
