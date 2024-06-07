import type { Meta, StoryObj } from '@storybook/react'
import { GraphQLError } from 'graphql'
import {
  ConfirmUserMutation,
  ConfirmUserMutationVariables,
  SendConfirmCodeMutation,
  SendConfirmCodeMutationVariables,
} from 'types/graphql'

import ConfirmUserModal from './ConfirmUserModal'

const meta: Meta<typeof ConfirmUserModal> = {
  component: ConfirmUserModal,
  tags: ['autodocs'],
  args: {
    isOpen: false,
    email: 'example@mail.com',
  },
  loaders: [
    () => {
      mockGraphQLMutation<
        SendConfirmCodeMutation,
        SendConfirmCodeMutationVariables
      >('SendConfirmCodeMutation', (_variables, { ctx }) => {
        ctx.delay(1000)
        alert('New code sent, check inbox')
        return { sendConfirmCode: true }
      })
    },
  ],
}

const confirmError: Partial<GraphQLError> = {
  message: 'Invalid or expired code',
  extensions: {
    code: 'BAD_USER_INPUT',
    properties: {
      messages: {
        code: ['Invalid or expired code'],
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof ConfirmUserModal>

export const Successful: Story = {
  render: (args) => {
    mockGraphQLMutation<ConfirmUserMutation, ConfirmUserMutationVariables>(
      'ConfirmUserMutation',
      (_variables, { ctx }) => {
        const id = Math.floor(Math.random() * 1000)
        ctx.delay(1000)
        return {
          confirmUser: {
            id,
          },
        }
      }
    )

    return (
      <>
        <ConfirmUserModal
          {...args}
          onClose={(success) => success && alert(`User confirmed`)}
        />
      </>
    )
  },
}

export const WithServerError: Story = {
  render: (args) => {
    mockGraphQLMutation<ConfirmUserMutation, ConfirmUserMutationVariables>(
      'ConfirmUserMutation',
      (_variables, { ctx }) => {
        ctx.delay(1000)
        ctx.errors([confirmError])
      }
    )

    return (
      <>
        <ConfirmUserModal {...args} />
      </>
    )
  },
}
