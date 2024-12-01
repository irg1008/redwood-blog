import { Resource } from '../src/i18n/i18n'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: Resource
  }
}
