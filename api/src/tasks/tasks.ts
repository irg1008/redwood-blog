import { TaskList } from 'graphile-worker'

import { sendConfirmUserEmailTask } from './sendConfirmUserEmailTask'
import { sendContactEmailTask } from './sendContactEmailTask'

export const tasks: TaskList = {
  send_contact_email: sendContactEmailTask,
  send_confirm_user_email: sendConfirmUserEmailTask,
}
