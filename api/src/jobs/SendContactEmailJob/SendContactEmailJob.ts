import { createContactSchema, v } from 'schemas'
import { CreateContactInput } from 'types/graphql'

import { jobs } from 'src/lib/jobs'
import { sendContactEmail } from 'src/services/mails/mails'

export const SendContactEmailJob = jobs.createJob({
  queue: 'emails',
  perform: async (payload: CreateContactInput) => {
    jobs.logger.info('SendContactEmailJob is performing...')
    v.parse(createContactSchema, payload)
    await sendContactEmail(payload)
  },
})
