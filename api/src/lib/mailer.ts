import { Mailer } from '@redwoodjs/mailer-core'
import { NodemailerMailHandler } from '@redwoodjs/mailer-handler-nodemailer'
import { ReactEmailRenderer } from '@redwoodjs/mailer-renderer-react-email'

import { logger } from 'src/lib/logger'

export const DOMAIN = 'example.com'

export const mailDirections = {
  noReply: `no-reply@${DOMAIN}`,
  contactReceiver: `contact@${DOMAIN}`,
} satisfies Record<string, `${string}@${typeof DOMAIN}`>

export const mailer = new Mailer({
  handling: {
    handlers: {
      nodemailer: new NodemailerMailHandler({
        transport: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      }),
    },
    default: 'nodemailer',
  },

  rendering: {
    renderers: {
      reactEmail: new ReactEmailRenderer(),
    },
    default: 'reactEmail',
  },

  logger,

  defaults: {
    replyTo: mailDirections.noReply,
    from: `"No Reply" <${mailDirections.noReply}>`,
  },
})
