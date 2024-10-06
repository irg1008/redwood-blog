import { jobs } from 'src/lib/jobs'
import { sendResetPasswordEmail } from 'src/services/mails/mails'

export const SendResetPasswordEmailJob = jobs.createJob({
  queue: 'default',
  perform: async (data: { resetToken: string; email: string }) => {
    jobs.logger.info('SendResetPasswordEmailJob is performing...')

    await sendResetPasswordEmail(data)
  },
})
