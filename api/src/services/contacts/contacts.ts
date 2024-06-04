import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validate } from '@redwoodjs/api'

import { db } from 'src/lib/db'
import { mailer } from 'src/lib/mailer'
import { ContactUsEmail } from 'src/mail/ContactUs/ContactUs'

export const contacts: QueryResolvers['contacts'] = () => {
  return db.contact.findMany()
}

export const contact: QueryResolvers['contact'] = ({ id }) => {
  return db.contact.findUnique({
    where: { id },
  })
}

export const createContact: MutationResolvers['createContact'] = async ({
  input,
}) => {
  validate(input.email, 'email', { email: true })

  await mailer.send(
    ContactUsEmail({
      ...input,
    }),
    {
      to: 'me@example.com',
      subject: 'New Contact Form Submission',
      replyTo: input.email,
      from: 'contact-us@example.com',
    }
  )

  return db.contact.create({
    data: input,
  })
}

export const updateContact = ({ id, input }) => {
  return db.contact.update({
    data: input,
    where: { id },
  })
}

export const deleteContact = ({ id }) => {
  return db.contact.delete({
    where: { id },
  })
}
