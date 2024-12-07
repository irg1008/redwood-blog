import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { schemaI18n } from 'schemas'

import { FieldPathByValue } from '@redwoodjs/forms'

import { listenI18nBroadcast } from '../lib/broadcast'

import en from './locales/en.json'
import es from './locales/es.json'

export enum Namespace {
  default = 'translation',
}

const resources: Record<Lang, Resource> = {
  en: { [Namespace.default]: en },
  es: { [Namespace.default]: es },
}

export const langs = ['en', 'es'] as const
export type Lang = (typeof langs)[number]

export type Resource = Record<Namespace, typeof en>
export type TranslatePath = FieldPathByValue<typeof en, string | string[]>

export const FALLBACK_LANG: Lang = 'en'

export const i18nInit = (lng?: string) => {
  if (i18next.isInitialized) {
    i18next.changeLanguage(lng)
    return
  }

  listenI18nBroadcast()

  const i18n = i18next
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      interpolation: {
        escapeValue: false, // React already does escaping
        defaultVariables: {
          appName: 'Blazing',
        },
      },
      lng,
      fallbackLng: FALLBACK_LANG,
      load: 'currentOnly',
      cleanCode: true,
      resources,
      supportedLngs: langs,
      detection: {
        convertDetectedLanguage: (lng) => lng.split('-')[0],
        caches: ['cookie'],
        lookupCookie: 'lang',
      },
    })

  i18next.services.formatter?.add('lowercase', (value) => {
    return value.toLowerCase()
  })

  i18next.on('languageChanged', (lng) => {
    schemaI18n.changeLanguage(lng)
  })

  return i18n
}

export default i18next
