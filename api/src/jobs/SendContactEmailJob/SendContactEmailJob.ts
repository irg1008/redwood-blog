import { createContactSchema, v } from 'schemas'
import { CreateContactInput } from 'types/graphql'

import { FALLBACK_LANG, i18nInit } from 'src/i18n/i18n'
import { jobs } from 'src/lib/jobs'
import { sendContactEmail } from 'src/services/mails/mails'

export const SendContactEmailJob = jobs.createJob({
  queue: 'emails',
  perform: async (
    payload: CreateContactInput,
    lang: string = FALLBACK_LANG
  ) => {
    jobs.logger.info('SendContactEmailJob is performing...')
    v.parse(createContactSchema, payload, { lang })

    await i18nInit(lang)
    await sendContactEmail(payload)
  },
})
