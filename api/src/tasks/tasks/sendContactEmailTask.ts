import { createContactSchema, v } from 'schemas/schemas'
import { CustomTask } from 'types/tasks'

import { sendContactEmail } from 'src/services/mails/mails'

import { withClientNotification } from '../notifyClient'

const sendContactEmailTask: CustomTask<'send_contact_email'> = async (
  payload,
  handlers
) => {
  if (!v.is(createContactSchema, payload)) {
    handlers.logger.error('Invalid payload', payload)
    return { success: false }
  }

  await sendContactEmail(payload)

  return { success: true }
}

export default withClientNotification(sendContactEmailTask)
