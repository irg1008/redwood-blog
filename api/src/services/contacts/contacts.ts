import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validate } from '@redwoodjs/api'

import { LanguageContext } from 'src/i18n/i18n'
import { SendContactEmailJob } from 'src/jobs/SendContactEmailJob/SendContactEmailJob'
import { db } from 'src/lib/db'
import { later } from 'src/lib/jobs'

export const contacts: QueryResolvers['contacts'] = () => {
  return db.contact.findMany()
}

export const contact: QueryResolvers['contact'] = ({ id }) => {
  return db.contact.findUnique({
    where: { id },
  })
}

export const createContact: MutationResolvers<LanguageContext>['createContact'] =
  async ({ input }, global) => {
    validate(input.email, 'email', { email: true })

    const lang = global?.context.req.language
    await later(SendContactEmailJob, [input, lang])

    return db.contact.create({
      data: input,
    })
  }

export const updateContact: MutationResolvers['updateContact'] = ({
  id,
  input,
}) => {
  return db.contact.update({
    data: {
      ...input,
      email: input.email ?? undefined,
      message: input.message ?? undefined,
    },
    where: { id },
  })
}

export const deleteContact: MutationResolvers['deleteContact'] = ({ id }) => {
  return db.contact.delete({
    where: { id },
  })
}
