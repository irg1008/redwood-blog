import { InMemoryMailHandler } from '@redwoodjs/mailer-handler-in-memory'

import { mailer } from 'src/lib/mailer'

import {
  sendConfirmUserEmail,
  sendContactEmail,
  sendResetPasswordEmail,
} from './mails'

describe('mails', () => {
  beforeEach(() => {
    const handler = mailer.getTestHandler() as InMemoryMailHandler
    handler.clearInbox()
  })

  it('sends reset password email', async () => {
    const resetData = {
      email: 'jane@doe.com',
      resetToken: '123456',
    }

    await sendResetPasswordEmail(resetData)

    const mailHandler = mailer.getTestHandler() as InMemoryMailHandler
    expect(mailHandler.inbox).toHaveLength(1)

    const [sentEmail] = mailHandler.inbox

    expect({
      ...sentEmail,
      htmlContent: undefined,
      textContent: undefined,
    }).toMatchInlineSnapshot(`
      {
        "attachments": [],
        "bcc": [],
        "cc": [],
        "from": ""No Reply" <no-reply@example.com>",
        "handler": "nodemailer",
        "handlerOptions": undefined,
        "headers": {},
        "htmlContent": undefined,
        "renderer": "reactEmail",
        "rendererOptions": {},
        "replyTo": "no-reply@example.com",
        "subject": "Reset your password",
        "textContent": undefined,
        "to": [
          "jane@doe.com",
        ],
      }
    `)

    expect(sentEmail.htmlContent).toMatchSnapshot()
    expect(sentEmail.textContent).toMatchSnapshot()

    const restLinkRegex = new RegExp(
      `/reset-password\\?resetToken=${resetData.resetToken}`,
      'g'
    )
    expect(sentEmail.htmlContent.match(restLinkRegex)).toHaveLength(2)
  })

  it('sends confirm account email', async () => {
    const confirmData = {
      email: 'jane@doe.com',
      code: 123456,
    }

    await sendConfirmUserEmail(confirmData)

    const mailHandler = mailer.getTestHandler() as InMemoryMailHandler
    expect(mailHandler.inbox).toHaveLength(1)

    const [sentEmail] = mailHandler.inbox

    expect({
      ...sentEmail,
      htmlContent: undefined,
      textContent: undefined,
    }).toMatchInlineSnapshot(`
      {
        "attachments": [],
        "bcc": [],
        "cc": [],
        "from": ""No Reply" <no-reply@example.com>",
        "handler": "nodemailer",
        "handlerOptions": undefined,
        "headers": {},
        "htmlContent": undefined,
        "renderer": "reactEmail",
        "rendererOptions": {},
        "replyTo": "no-reply@example.com",
        "subject": "Confirm your account",
        "textContent": undefined,
        "to": [
          "jane@doe.com",
        ],
      }
    `)

    expect(sentEmail.htmlContent).toMatchSnapshot()
    expect(sentEmail.textContent).toMatchSnapshot()

    expect(sentEmail.htmlContent).toContain(confirmData.code.toString())

    const codeRegex = new RegExp(`\n${confirmData.code}\n`, 'g')
    expect(sentEmail.textContent.match(codeRegex)).not.toBeNull()
  })

  it('sends contact email', async () => {
    const contactData = {
      email: 'jane@doe.com',
      message: 'Hello!',
      name: 'Jane Doe',
    }

    await sendContactEmail(contactData)

    const mailHandler = mailer.getTestHandler() as InMemoryMailHandler
    expect(mailHandler.inbox).toHaveLength(1)

    const [sentEmail] = mailHandler.inbox

    expect({
      ...sentEmail,
      htmlContent: undefined,
      textContent: undefined,
    }).toMatchInlineSnapshot(`
      {
        "attachments": [],
        "bcc": [],
        "cc": [],
        "from": ""No Reply" <no-reply@example.com>",
        "handler": "nodemailer",
        "handlerOptions": undefined,
        "headers": {},
        "htmlContent": undefined,
        "renderer": "reactEmail",
        "rendererOptions": {},
        "replyTo": "jane@doe.com",
        "subject": "New Contact Form Submission",
        "textContent": undefined,
        "to": [
          "contact@example.com",
        ],
      }
    `)

    expect(sentEmail.htmlContent).toMatchSnapshot()
    expect(sentEmail.textContent).toMatchSnapshot()
  })
})
