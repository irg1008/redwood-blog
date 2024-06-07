import { ConfirmUserInput, CreateContactInput } from './graphql'

declare global {
  namespace GraphileWorker {
    interface Tasks {
      send_contact_email: CreateContactInput
      send_confirm_user_email: ConfirmUserInput
    }
  }
}
