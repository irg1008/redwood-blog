import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { schemaI18n } from 'schemas'

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

i18n
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    ns: [Namespace.default],
    defaultNS: Namespace.default,
    interpolation: {
      escapeValue: false, // React already does escaping
      defaultVariables: {
        appName: 'Blazing',
      },
    },
    fallbackLng: 'en',
    load: 'currentOnly',
    cleanCode: true,
    resources,
    supportedLngs: langs,
    detection: {
      convertDetectedLanguage: (lng) => lng.split('-')[0],
    },
  })

i18n.on('languageChanged', (lng) => {
  schemaI18n.changeLanguage(lng)
})

export default i18n
