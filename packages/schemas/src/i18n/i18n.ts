import { createInstance, i18n } from 'i18next'
import * as v from 'valibot'

import en from './locales/en.json'
import es from './locales/es.json'

export const langs = ['en', 'es'] as const
export type Lang = (typeof langs)[number]

export enum Namespace {
  default = 'translation',
}

export type Resource = Record<Namespace, typeof en>

const resources: Record<Lang, Resource> = {
  en: { [Namespace.default]: en },
  es: { [Namespace.default]: es },
}

export const schemaI18n: i18n = createInstance({
  interpolation: {
    escapeValue: false, // React already does escaping
  },
  fallbackLng: 'en',
  resources,
  supportedLngs: langs,
})

schemaI18n.on('languageChanged', (lng) => {
  v.setGlobalConfig({ lang: lng })
})

schemaI18n.init()
