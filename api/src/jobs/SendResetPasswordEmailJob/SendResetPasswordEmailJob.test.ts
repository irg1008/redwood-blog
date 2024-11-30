import { jobs } from 'src/lib/jobs'
import * as mails from 'src/services/mails/mails'

import { SendResetPasswordEmailJob } from './SendResetPasswordEmailJob'

type ResetPasswordInput = Parameters<
  typeof SendResetPasswordEmailJob.perform
>[0]

const resetPasswordInput = {
  invalidToken: {
    resetToken: null,
    email: 'example@email.com',
  },
  invalidEmail: {
    resetToken: '123456',
    email: '',
  },
  validData: {
    resetToken: '123456',
    email: 'example@email.com',
  },
} satisfies Record<string, ResetPasswordInput>

describe('SendResetPasswordEmailJob', () => {
  it('Should add info entry to logger', () => {
    const loggerInfo = jest.spyOn(jobs.logger, 'info')
    SendResetPasswordEmailJob.perform(resetPasswordInput.validData)
    expect(loggerInfo).toHaveBeenCalled()
  })

  it("should call sendConfirmUserEmail with the payload's data", () => {
    const payload = resetPasswordInput.validData

    const sendResetPasswordEmail = jest.spyOn(mails, 'sendResetPasswordEmail')

    SendResetPasswordEmailJob.perform(payload)
    expect(sendResetPasswordEmail).toHaveBeenCalledWith(payload)
  })
})
