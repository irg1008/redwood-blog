import { ConfirmUserInput, CreateContactInput } from 'types/graphql'
import type { GenericSchema } from 'valibot'
import * as v from 'valibot'

export * as v from 'valibot'
export { schemaI18n }

import { schemaI18n } from './i18n/i18n'
import { m as t } from './i18n/m'
export { t }

type Schema<T> = Record<keyof T, GenericSchema>

const emailSchema = v.pipe(
  v.string(),
  v.nonEmpty(t('email.nonEmpty')),
  v.email(t('email.email')),
  v.maxLength(200, t('email.maxLength'))
)

export const createContactSchema = v.object<Schema<CreateContactInput>>({
  email: emailSchema,
  message: v.pipe(
    v.string(),
    v.nonEmpty(t('createContact.nonEmpty')),
    v.maxLength(5000, t('createContact.maxLength'))
  ),
  name: v.optional(v.string()),
})

export const codeSchema = v.pipe(
  v.union([v.string(), v.number()]),
  v.transform(String),
  v.nonEmpty(t('code.nonEmpty')),
  v.length(6, t('code.length')),
  v.regex(/^[0-9]{6}$/, t('code.regex'))
)

export const confirmCodeSchema = v.object<Schema<{ code: string }>>({
  code: codeSchema,
})

export const confirmUserSchema = v.object<Schema<ConfirmUserInput>>({
  code: codeSchema,
  email: emailSchema,
})

export const sendChatMessageSchema = v.object<Schema<{ body: string }>>({
  body: v.pipe(
    v.string(),
    v.nonEmpty(t('sendChatMessage.nonEmpty')),
    v.maxLength(5000, t('sendChatMessage.maxLength'))
  ),
})

export const passwordSchema = v.pipe(
  v.string(),
  v.nonEmpty(t('password.nonEmpty')),
  v.minLength(8, t('password.minLength')),
  v.maxLength(50, t('password.maxLength')),
  v.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, t('password.regex'))
)

export const loginSchema = v.object<
  Schema<{ username: string; password: string }>
>({
  username: emailSchema,
  password: passwordSchema,
})

export const forgotPasswordSchema = v.pick(loginSchema, ['username'])

export const resetPasswordSchema = v.pick(loginSchema, ['password'])

export const signupSchema = loginSchema
