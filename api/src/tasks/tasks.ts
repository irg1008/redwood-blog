import { TaskList } from 'graphile-worker'

import { sendContactEmailTask } from './send_contact_email'

export const tasks: TaskList = {
  send_contact_email: sendContactEmailTask,
}
