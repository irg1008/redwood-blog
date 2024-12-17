import type { Meta, StoryObj } from '@storybook/react'
import {
  SendChatMessageMutation,
  SendChatMessageMutationVariables
} from 'types/graphql'


import ChatBox from './ChatBox'

const meta: Meta<typeof ChatBox> = {
  component: ChatBox,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ChatBox>

export const LoggedIn: Story = {
  render: (args) => {
    mockCurrentUser({
      id: 1,
      email: 'user@email.com',
      roles: 'user',
    })

    mockGraphQLMutation<
      SendChatMessageMutation,
      SendChatMessageMutationVariables
    >('SendChatMessageMutation', ({ input }) => {
      return {
        sendChatMessage: {
          body: input.body,
          createdAt: new Date().toISOString(),
          id: Math.floor(Math.random() * 1000).toString(),
          user: {
            email: 'User 1',
            id: 1,
          },
        },
      }
    })

    return <ChatBox {...args} />
  },
}

export const LoggedOut: Story = {
  render: (args) => {
    mockCurrentUser(null)

    return <ChatBox {...args} />
  },
}
