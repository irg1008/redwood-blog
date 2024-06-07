import { Task } from 'graphile-worker'
import { confirmUserSchema, v } from 'schemas/schemas'

import { sendConfirmUserEmail } from 'src/services/mails/mails'

export const sendConfirmUserEmailTask: Task<'send_confirm_user_email'> = async (
  payload,
  handlers
) => {
  if (!v.is(confirmUserSchema, payload)) {
    return handlers.logger.error('Invalid payload', payload)
  }

  await sendConfirmUserEmail(payload)
}
