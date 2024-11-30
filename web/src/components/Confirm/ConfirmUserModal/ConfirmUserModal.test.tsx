import userEvent from '@testing-library/user-event'
import { GraphQLError } from 'graphql'
import {
  ConfirmUserMutation,
  ConfirmUserMutationVariables,
  SendConfirmCodeMutation,
  SendConfirmCodeMutationVariables,
} from 'types/graphql'

import { render, screen, waitFor } from '@redwoodjs/testing/web'

import ConfirmUserModal from './ConfirmUserModal'

const confirmError: Partial<GraphQLError> = {
  message: 'Invalid code',
  extensions: {
    code: 'BAD_USER_INPUT',
    properties: {
      messages: {
        code: ['Invalid code'],
      },
    },
  },
}

describe('ConfirmUserModal', () => {
  const email = 'example@mail.com'

  it('displays the email', async () => {
    const res = render(<ConfirmUserModal email={email} isOpen={true} />)

    const modalHeader = await res.findByText(`Confirm ${email}`)
    expect(modalHeader).toBeInTheDocument()
    expect(modalHeader.tagName).toEqual('HEADER')
  })

  it('has confirm and code input', async () => {
    render(<ConfirmUserModal email={email} isOpen={true} />)

    const input = screen.getByLabelText('Code')
    expect(input).toBeInTheDocument()

    const confirm = screen.getByText('Confirm')
    expect(confirm).toBeInTheDocument()
  })

  it('has a button to fetch a new code', async () => {
    const mockCalled = jest.fn()

    mockGraphQLMutation<
      SendConfirmCodeMutation,
      SendConfirmCodeMutationVariables
    >('SendConfirmCodeMutation', (variables) => {
      mockCalled()
      expect(variables.email).toEqual(email)
      return { sendConfirmCode: true }
    })

    render(<ConfirmUserModal email={email} isOpen={true} />)

    const resend = screen.getByText('Send a new code')
    expect(resend).toBeInTheDocument()

    await waitFor(() => userEvent.click(resend))

    await waitFor(async () => {
      expect(mockCalled).toHaveBeenCalled()
      expect(mockCalled).toHaveBeenCalledTimes(1)
    })
  })

  it('confirms the user correctly', async () => {
    const mockCalled = jest.fn()
    const correctCode = 222222

    const closeCallback = jest.fn()

    mockGraphQLMutation<ConfirmUserMutation, ConfirmUserMutationVariables>(
      'ConfirmUserMutation',
      ({ input }) => {
        mockCalled()
        expect(input.code).toEqual(correctCode)
        expect(input.email).toEqual(email)
        return { confirmUser: { id: 1 } }
      }
    )

    render(
      <ConfirmUserModal email={email} isOpen={true} onClose={closeCallback} />
    )

    const input = screen.getByLabelText('Code')
    const confirm = screen.getByText('Confirm')

    await waitFor(() => userEvent.type(input, correctCode.toString()))
    await waitFor(() => userEvent.click(confirm))

    await waitFor(() => {
      expect(mockCalled).toHaveBeenCalled()
      expect(mockCalled).toHaveBeenCalledTimes(1)

      expect(closeCallback).toHaveBeenCalled()
      expect(closeCallback).toHaveBeenCalledTimes(1)
      expect(closeCallback).toHaveBeenCalledWith(true)
    })
  })

  it('displays an error on invalid code', async () => {
    const incorrectCode = 111111
    const errorText = 'Invalid code'

    const closeCallback = jest.fn()

    mockGraphQLMutation<ConfirmUserMutation, ConfirmUserMutationVariables>(
      'ConfirmUserMutation',
      (_variables, { ctx }) => {
        ctx.errors([confirmError])
      }
    )

    render(
      <ConfirmUserModal email={email} isOpen={true} onClose={closeCallback} />
    )

    const input = screen.getByLabelText('Code')
    const confirm = screen.getByText('Confirm')

    await waitFor(() => userEvent.type(input, incorrectCode.toString()))
    await waitFor(() => userEvent.click(confirm))

    const error = await screen.findByText(errorText)
    expect(error).toBeInTheDocument()

    await waitFor(() => {
      expect(closeCallback).not.toHaveBeenCalled()
    })
  })

  // it('closing the modal calls the onClose callback', async () => {
  //   const closeCallback = jest.fn()
  //   render(
  //     <ConfirmUserModal email={email} isOpen={true} onClose={closeCallback} />
  //   )

  //   const close = screen.getByLabelText('Close')
  //   expect(close).toBeInTheDocument()

  //   await waitFor(() => userEvent.click(close))

  //   expect(closeCallback).toHaveBeenCalled()
  //   expect(closeCallback).toHaveBeenCalledTimes(1)
  //   expect(closeCallback).toHaveBeenCalledWith()
  // })
})
