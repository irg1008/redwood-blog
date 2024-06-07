import { Task } from 'graphile-worker'

import { sendContactEmail } from 'src/services/mails/mails'

export const sendContactEmailTask: Task<'send_contact_email'> = async (
  payload
) => {
  await sendContactEmail(payload)
}
