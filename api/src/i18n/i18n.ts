import type { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { parse } from 'cookie'
import type { FastifyInstance } from 'fastify'
import i18next from 'i18next'
import i18nextMiddleware, { I18NextRequest } from 'i18next-http-middleware'

import type { RedwoodGraphQLContext } from '@redwoodjs/graphql-server'

import en from './locales/en'
import es from './locales/es'

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

export const FALLBACK_LANG: Lang = 'en'

export const i18nInit = (lng?: string) => {
  if (i18next.isInitialized) {
    i18next.changeLanguage(lng)
    return
  }

  return i18next.use(i18nextMiddleware.LanguageDetector).init({
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
      lookupCookie: 'lang',
    },
  })
}

export const registeri18nMiddleware = async (app: FastifyInstance) => {
  await i18nInit()

  return app.register((app, _opts, next) =>
    i18nextMiddleware.plugin(app, { i18next }, (err) => next(err))
  )
}

export const getEventLanguage = (event: APIGatewayProxyEvent): string => {
  const cookie = event.headers.cookie || ''
  const cookies = parse(cookie)
  return cookies.lang || FALLBACK_LANG
}

export const getLanguageContext = (
  event: APIGatewayProxyEvent,
  requestContext: Context
): LanguageContext => {
  return {
    event,
    requestContext,
    req: {
      language: getEventLanguage(event),
      languages: Array.from(langs),
    },
  }
}

export default i18next

export type I18nContext = RedwoodGraphQLContext & { req: I18NextRequest }

export type LanguageContext = RedwoodGraphQLContext & {
  req: Pick<I18NextRequest, 'language' | 'languages'>
}
