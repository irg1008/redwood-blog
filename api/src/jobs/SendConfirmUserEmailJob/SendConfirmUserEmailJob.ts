import { confirmUserSchema, v } from 'schemas'
import { ConfirmUserInput } from 'types/graphql'

import { i18nInit } from 'src/i18n/i18n'
import { jobs } from 'src/lib/jobs'
import { sendConfirmUserEmail } from 'src/services/mails/mails'

export const SendConfirmUserEmailJob = jobs.createJob({
  queue: 'emails',
  perform: async (payload: ConfirmUserInput, lang: string) => {
    jobs.logger.info('SendConfirmUserEmailJob is performing...')
    v.parse(confirmUserSchema, payload, { lang })

    await i18nInit(lang)
    await sendConfirmUserEmail(payload)
  },
})
