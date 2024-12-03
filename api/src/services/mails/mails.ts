import { t } from 'i18next'
import type { ConfirmUserInput, CreateContactInput } from 'types/graphql'

import { MailAddress } from '@redwoodjs/mailer-core'

import { mailDirections, mailer } from 'src/lib/mailer'
import { ConfirmCodeEmail } from 'src/mail/ConfirmCodeEmail/ConfirmCodeEmail'
import { ContactUsEmail } from 'src/mail/ContactUsEmail/ContactUsEmail'
import { ResetPasswordEmail } from 'src/mail/ResetPasswordEmail/ResetPasswordEmail'

const getNoReplyAddress = (): MailAddress => ({
  name: t('emails.no-reply'),
  address: mailDirections.noReply,
})

export const sendResetPasswordEmail = async ({
  email,
  resetToken,
}: {
  email: string
  resetToken: string
}) => {
  const resetLink = `${process.env.WEB_URI}/reset-password?resetToken=${resetToken}`

  return await mailer.send(
    ResetPasswordEmail({
      email,
      resetLink,
    }),
    {
      to: email,
      subject: t('emails.reset-password.subject'),
      from: getNoReplyAddress(),
    }
  )
}

export const sendConfirmUserEmail = async (input: ConfirmUserInput) => {
  return await mailer.send(ConfirmCodeEmail(input), {
    to: input.email,
    subject: t('emails.confirm-user.subject'),
    from: getNoReplyAddress(),
  })
}

export const sendContactEmail = async (input: CreateContactInput) => {
  return await mailer.send(ContactUsEmail(input), {
    to: mailDirections.contactReceiver,
    subject: t('emails.contact.subject'),
    replyTo: input.email,
    from: getNoReplyAddress(),
  })
}
