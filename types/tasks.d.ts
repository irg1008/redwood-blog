import { ConfirmUserInput, CreateContactInput } from 'api/types/graphql'
import { JobHelpers } from 'graphile-worker'

declare global {
  namespace GraphileWorker {
    interface Tasks extends TaskPayload {}
  }
}

type Task = 'send_contact_email' | 'send_confirm_user_email'

type BasePayloads = {
  send_contact_email: CreateContactInput
  send_confirm_user_email: ConfirmUserInput
}

type BaseResponses = {
  send_contact_email: never
  send_confirm_user_email: never
}

type ValidateTaskCorrespondence<T extends Task> = {
  [K in T]: K extends keyof BasePayloads
    ? K extends keyof BaseResponses
      ? unknown
      : never
    : never
}

export type TaskPayload = {
  [K in keyof ValidateTaskCorrespondence<Task>]: BasePayloads[K]
}

export type TaskResponse = {
  [K in keyof ValidateTaskCorrespondence<Task>]: BaseResponses[K] extends never
    ? ResponseStatus
    : BaseResponses[K] & ResponseStatus
}

export type ResponseStatus = {
  success: boolean
}

export type CustomTask<TK extends keyof TaskPayload> = (
  payload: TaskPayload[TK],
  handlers: JobHelpers
) => Promise<TaskResponse[TK]>
