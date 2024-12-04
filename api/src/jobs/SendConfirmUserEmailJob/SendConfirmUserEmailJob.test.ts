import { ConfirmUserInput } from 'types/graphql'

import { jobs } from 'src/lib/jobs'
import * as mails from 'src/services/mails/mails'

import { SendConfirmUserEmailJob } from './SendConfirmUserEmailJob'

const confirmUserInput = {
  invalidCode: {
    code: 12,
    email: 'example@email.com',
  },
  invalidEmail: {
    code: 123456,
    email: '',
  },
  validData: {
    code: 123456,
    email: 'example@email.com',
  },
} satisfies Record<string, ConfirmUserInput>

describe('SendConfirmUserEmailJob', () => {
  it('Should add info entry to logger', async () => {
    const loggerInfo = jest.spyOn(jobs.logger, 'info')

    await SendConfirmUserEmailJob.perform(confirmUserInput.validData)
    expect(loggerInfo).toHaveBeenCalled()
  })

  it("should call sendConfirmUserEmail with the payload's data", async () => {
    const payload = confirmUserInput.validData
    const sendConfirmUserEmail = jest.spyOn(mails, 'sendConfirmUserEmail')

    await SendConfirmUserEmailJob.perform(payload)
    expect(sendConfirmUserEmail).toHaveBeenCalledWith(payload)
  })

  it('The job should check data schema', () => {
    expect(() =>
      SendConfirmUserEmailJob.perform(confirmUserInput.invalidCode)
    ).rejects.toThrow()

    expect(() =>
      SendConfirmUserEmailJob.perform(confirmUserInput.invalidEmail)
    ).rejects.toThrow()

    expect(() =>
      SendConfirmUserEmailJob.perform(confirmUserInput.validData)
    ).not.toThrow()
  })
})
