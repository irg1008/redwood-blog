import { Task } from 'graphile-worker'

import { sendContactEmail } from 'src/services/mails/mails'

const send_contact_email: Task<'send_contact_email'> = async (payload) => {
  await sendContactEmail(payload)
}

export default send_contact_email
