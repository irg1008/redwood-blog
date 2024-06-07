import type { MutationcreateContactArgs } from 'types/graphql'

import { mailDirections, mailer } from 'src/lib/mailer'
import { ConfirmCodeEmail } from 'src/mail/ConfirmCodeEmail/ConfirmCodeEmail'
import { ContactUsEmail } from 'src/mail/ContactUsEmail/ContactUsEmail'
import { ResetPasswordEmail } from 'src/mail/ResetPasswordEmail/ResetPasswordEmail'

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
      subject: 'Reset your password',
    }
  )
}

export const sendConfirmAccountEmail = async ({
  code,
  email,
}: {
  code: number
  email: string
}) => {
  return await mailer.send(ConfirmCodeEmail({ code }), {
    to: email,
    subject: 'Confirm your account',
  })
}

export const sendContactEmail = async (
  input: MutationcreateContactArgs['input']
) => {
  return await mailer.send(ContactUsEmail(input), {
    to: mailDirections.contactReceiver,
    subject: 'New Contact Form Submission',
    replyTo: input.email,
  })
}
