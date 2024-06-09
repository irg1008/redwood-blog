import { TaskList } from 'graphile-worker'

import sendConfirmUserEmailTask from './tasks/sendConfirmUserEmailTask'
import sendContactEmailTask from './tasks/sendContactEmailTask'

export const tasks: TaskList = {
  send_contact_email: sendContactEmailTask,
  send_confirm_user_email: sendConfirmUserEmailTask,
}
