import { CreateContactInput } from './graphql'

declare global {
  namespace GraphileWorker {
    interface Tasks {
      send_contact_email: CreateContactInput
    }
  }
}
