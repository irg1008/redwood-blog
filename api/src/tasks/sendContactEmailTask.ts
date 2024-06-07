import { Task } from 'graphile-worker'
import { createContactSchema, v } from 'schemas/schemas'

import { sendContactEmail } from 'src/services/mails/mails'

export const sendContactEmailTask: Task<'send_contact_email'> = async (
  payload,
  handlers
) => {
  if (!v.is(createContactSchema, payload)) {
    return handlers.logger.error('Invalid payload', payload)
  }

  await sendContactEmail(payload)
}
