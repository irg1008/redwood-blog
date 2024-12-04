import { FALLBACK_LANG, i18nInit } from 'src/i18n/i18n'
import { jobs } from 'src/lib/jobs'
import { sendResetPasswordEmail } from 'src/services/mails/mails'

export const SendResetPasswordEmailJob = jobs.createJob({
  queue: 'emails',
  perform: async (
    data: { resetToken: string; email: string },
    lang: string = FALLBACK_LANG
  ) => {
    jobs.logger.info('SendResetPasswordEmailJob is performing...')

    await i18nInit(lang)
    await sendResetPasswordEmail(data)
  },
})
