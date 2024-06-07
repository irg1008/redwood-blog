import { ConfirmUserInput, CreateContactInput } from 'types/graphql'
import type { GenericSchema } from 'valibot'
import * as v from 'valibot'
export * as v from 'valibot'

type Schema<T> = Record<keyof T, GenericSchema>

const emailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Please enter your email'),
  v.email('the email is badly formatted'),
  v.maxLength(50, 'The email is too long')
)

export const createContactSchema = v.object<Schema<CreateContactInput>>({
  email: emailSchema,
  message: v.pipe(
    v.string(),
    v.nonEmpty('Please enter a message'),
    v.maxLength(5000, 'The message is too long')
  ),
  name: v.optional(v.string()),
})

export const codeSchema = v.pipe(
  v.string(),
  v.nonEmpty('Please enter the code'),
  v.regex(/^[0-9]{6}$/, 'Invalid code format. Must be a 6 digit code')
)

export const confirmCodeSchema = v.object<Schema<{ code: string }>>({
  code: codeSchema,
})

export const confirmUserSchema = v.object<Schema<ConfirmUserInput>>({
  code: v.number(),
  email: emailSchema,
})
