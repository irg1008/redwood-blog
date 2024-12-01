import { ConfirmUserInput, CreateContactInput } from 'types/graphql'
import type { GenericSchema } from 'valibot'
import * as v from 'valibot'

export * as v from 'valibot'
export { schemaI18n }

import { schemaI18n } from './i18n/i18n'
import { m as t } from './i18n/m'

type Schema<T> = Record<keyof T, GenericSchema>

const emailSchema = v.pipe(
  v.string(),
  v.nonEmpty(t('email.nonEmpty')),
  v.email(t('email.email')),
  v.maxLength(50, t('email.maxLength'))
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
  v.string(),
  v.nonEmpty(t('code.nonEmpty')),
  v.length(6, t('code.length')),
  v.regex(/^[0-9]{6}$/, t('code.regex'))
)

export const confirmCodeSchema = v.object<Schema<{ code: string }>>({
  code: codeSchema,
})

export const confirmUserSchema = v.object<Schema<ConfirmUserInput>>({
  code: v.number(),
  email: emailSchema,
})

export const sendChatMessageSchema = v.object<Schema<{ body: string }>>({
  body: v.pipe(
    v.string(),
    v.nonEmpty(t('sendChatMessage.nonEmpty')),
    v.maxLength(5000, t('sendChatMessage.maxLength'))
  ),
})
