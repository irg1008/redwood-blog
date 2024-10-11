import { confirmUserSchema, v } from 'schemas'
import { ConfirmUserInput } from 'types/graphql'

import { jobs } from 'src/lib/jobs'
import { sendConfirmUserEmail } from 'src/services/mails/mails'

export const SendConfirmUserEmailJob = jobs.createJob({
  queue: 'emails',
  perform: async (payload: ConfirmUserInput) => {
    jobs.logger.info('SendConfirmUserEmailJob is performing...')
    v.parse(confirmUserSchema, payload)
    await sendConfirmUserEmail(payload)
  },
})
