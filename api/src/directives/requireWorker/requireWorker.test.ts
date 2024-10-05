import { signPayload } from '@redwoodjs/api/webhooks'
import { getDirectiveName, mockRedwoodDirective } from '@redwoodjs/testing/api'

import requireWorker from './requireWorker'

describe('requireAuth directive', () => {
  it('declares the directive sdl as schema, with the correct name', () => {
    expect(requireWorker.schema).toBeTruthy()
    expect(getDirectiveName(requireWorker.schema)).toBe('requireWorker')
  })

  it('requireAuth has stub implementation. Should not throw when valid event and signature', () => {
    const signature = signPayload('timestampSchemeVerifier', {
      payload: JSON.stringify({ example: 'example' }),
      secret: process.env.WORKER_SECRET,
    })

    const mockExecution = mockRedwoodDirective(requireWorker, {
      context: {
        event: {
          headers: {
            [process.env.WORKER_SIGNATURE]: signature,
          },
          body: JSON.stringify({
            variables: { example: 'example' },
          }),
        },
      },
    })

    expect(mockExecution).not.toThrow()
  })
})
