import { CreateContactInput } from 'types/graphql'

import { jobs } from 'src/lib/jobs'
import * as mails from 'src/services/mails/mails'

import { SendContactEmailJob } from './SendContactEmailJob'

const contactInput = {
  invalidMessage: {
    email: 'example@email.com',
    message: '',
  },
  invalidEmail: {
    email: '',
    message: 'Hello, World!',
  },
  invalidName: {
    email: 'example@email.com',
    message: 'Hello, World!',
    name: null,
  },
  validData: {
    email: 'example@email.com',
    message: 'Hello, World!',
    name: 'John Doe',
  },
} satisfies Record<string, CreateContactInput>

describe('SendContactEmailJob', () => {
  it('Should add info entry to logger', () => {
    const loggerInfo = jest.spyOn(jobs.logger, 'info')
    SendContactEmailJob.perform(contactInput.validData)
    expect(loggerInfo).toHaveBeenCalled()
  })

  it("should call sendContactEmail with the payload's data", () => {
    const payload = contactInput.validData

    const sendContactEmail = jest.spyOn(mails, 'sendContactEmail')

    SendContactEmailJob.perform(payload)
    expect(sendContactEmail).toHaveBeenCalledWith(payload)
  })

  it('The job should check data schema', () => {
    expect(() =>
      SendContactEmailJob.perform(contactInput.invalidMessage)
    ).rejects.toThrow()

    expect(() =>
      SendContactEmailJob.perform(contactInput.invalidEmail)
    ).rejects.toThrow()

    expect(() =>
      SendContactEmailJob.perform(contactInput.invalidName)
    ).rejects.toThrow()

    expect(() =>
      SendContactEmailJob.perform(contactInput.validData)
    ).not.toThrow()
  })
})
