import { TaskList } from 'graphile-worker'

import send_contact_email from './send_contact_email'

export const tasks: TaskList = {
  send_contact_email,
}
