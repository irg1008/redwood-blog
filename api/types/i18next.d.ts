import type { Resource } from 'src/i18n/i18n'

import 'i18next'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: Resource
  }
}
