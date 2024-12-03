import { createInstance, i18n } from 'i18next'
import * as v from 'valibot'

import en from './locales/en.json'
import es from './locales/es.json'

export enum Namespace {
  default = 'translation',
}

export type Resource = Record<Namespace, typeof en>

const resources: Record<Lang, Resource> = {
  en: { [Namespace.default]: en },
  es: { [Namespace.default]: es },
}

export const langs = ['en', 'es'] as const
export type Lang = (typeof langs)[number]

export const FALLBACK_LANG: Lang = 'en'

export const schemaI18n: i18n = createInstance({
  interpolation: {
    escapeValue: false, // React already does escaping
  },
  fallbackLng: FALLBACK_LANG,
  resources,
  supportedLngs: langs,
})

schemaI18n.init()

schemaI18n.on('languageChanged', (lng) => {
  v.setGlobalConfig({ lang: lng })
})
