import { jobs } from 'src/lib/jobs'
import * as mails from 'src/services/mails/mails'

import { SendResetPasswordEmailJob } from './SendResetPasswordEmailJob'

type ResetPasswordInput = Parameters<
  typeof SendResetPasswordEmailJob.perform
>[0]

const resetPasswordInput = {
  invalidToken: {
    resetToken: '',
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
  it('Should add info entry to logger', async () => {
    const loggerInfo = jest.spyOn(jobs.logger, 'info')

    await SendResetPasswordEmailJob.perform(resetPasswordInput.validData)
    expect(loggerInfo).toHaveBeenCalled()
  })

  it("should call sendConfirmUserEmail with the payload's data", async () => {
    const payload = resetPasswordInput.validData
    const sendResetPasswordEmail = jest.spyOn(mails, 'sendResetPasswordEmail')

    await SendResetPasswordEmailJob.perform(payload)
    expect(sendResetPasswordEmail).toHaveBeenCalledWith(payload)
  })
})
