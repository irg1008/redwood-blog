export type { ParseKeys as TranslatePath } from 'i18next'

import type { Resource } from 'src/i18n/i18n'

import 'i18next'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: Resource
  }
}
