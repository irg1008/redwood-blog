import type { Meta, StoryObj } from '@storybook/react'
import { ChatMessagesQuery, ChatMessagesQueryVariables } from 'types/graphql'

import { standard } from '../ChatMessagesCell/ChatMessagesCell.mock'

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

    mockGraphQLQuery<ChatMessagesQuery, ChatMessagesQueryVariables>(
      'ChatMessagesQuery',
      (_variables) => {
        return {
          chatMessages: standard().chatMessages,
        }
      }
    )

    return <ChatBox {...args} />
  },
}

export const LoggedOut: Story = {
  render: (args) => {
    mockCurrentUser(null)

    mockGraphQLQuery<ChatMessagesQuery, ChatMessagesQueryVariables>(
      'ChatMessagesQuery',
      (_variables) => {
        return {
          chatMessages: standard().chatMessages,
        }
      }
    )

    return <ChatBox {...args} />
  },
}
