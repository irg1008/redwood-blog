import type { BaseIssue, ErrorMessage } from 'valibot'

import { schemaI18n } from './i18n'

type M = (
  ...params: Parameters<typeof schemaI18n.t>
) => ErrorMessage<BaseIssue<unknown>>

export const m: M = (...[key]) => {
  return (issue) => schemaI18n.t(key as TemplateStringsArray, { ...issue })
}
