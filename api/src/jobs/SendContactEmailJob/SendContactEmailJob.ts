import { CreateContactInput } from 'types/graphql'

import { jobs } from 'src/lib/jobs'
import { sendContactEmail } from 'src/services/mails/mails'

export const SendContactEmailJob = jobs.createJob({
  queue: 'default',
  perform: async (payload: CreateContactInput) => {
    jobs.logger.info('SendContactEmailJob is performing...')

    // if (!v.is(createContactSchema, payload)) {
    //   jobs.logger.error('Invalid payload', payload)
    //   return
    // }

    await sendContactEmail(payload)
  },
})
