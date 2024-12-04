import { InMemoryMailHandler } from '@redwoodjs/mailer-handler-in-memory'

import { i18nInit } from 'src/i18n/i18n'
import { mailDirections, mailer } from 'src/lib/mailer'

import {
  getNoReplyAddress,
  sendConfirmUserEmail,
  sendContactEmail,
  sendResetPasswordEmail,
} from './mails'

describe('mails', () => {
  let noReplyAddressString: string

  beforeAll(async () => {
    await i18nInit('cimode')
  })

  beforeEach(async () => {
    const handler = mailer.getTestHandler() as InMemoryMailHandler
    handler.clearInbox()

    const noReplyAddress = getNoReplyAddress()
    noReplyAddressString = `${noReplyAddress.name} <${noReplyAddress.address}>`
  })

  it('sets a proper no reply address', () => {
    expect(getNoReplyAddress()).toEqual({
      name: 'emails.no-reply',
      address: mailDirections.noReply,
    })
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
        "from": "${noReplyAddressString}",
        "handler": "nodemailer",
        "handlerOptions": undefined,
        "headers": {},
        "htmlContent": undefined,
        "renderer": "reactEmail",
        "rendererOptions": {},
        "replyTo": "${mailDirections.noReply}",
        "subject": "emails.reset-password.subject",
        "textContent": undefined,
        "to": [
          "${resetData.email}",
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
        "from": "${noReplyAddressString}",
        "handler": "nodemailer",
        "handlerOptions": undefined,
        "headers": {},
        "htmlContent": undefined,
        "renderer": "reactEmail",
        "rendererOptions": {},
        "replyTo": "${mailDirections.noReply}",
        "subject": "emails.confirm-user.subject",
        "textContent": undefined,
        "to": [
          "${confirmData.email}",
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
        "from": "${noReplyAddressString}",
        "handler": "nodemailer",
        "handlerOptions": undefined,
        "headers": {},
        "htmlContent": undefined,
        "renderer": "reactEmail",
        "rendererOptions": {},
        "replyTo": "${contactData.email}",
        "subject": "emails.contact.subject",
        "textContent": undefined,
        "to": [
          "${mailDirections.contactReceiver}",
        ],
      }
    `)

    expect(sentEmail.htmlContent).toMatchSnapshot()
    expect(sentEmail.textContent).toMatchSnapshot()
  })
})
