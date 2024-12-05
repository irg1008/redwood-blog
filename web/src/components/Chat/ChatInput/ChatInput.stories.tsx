// Pass props to your component by passing an `args` object to your story
//
// ```tsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'
import {
  SendChatMessageMutation,
  SendChatMessageMutationVariables,
} from 'types/graphql'

import ChatInput from './ChatInput'

const meta: Meta<typeof ChatInput> = {
  component: ChatInput,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ChatInput>

export const Primary: Story = {
  render: (args) => {
    mockGraphQLMutation<
      SendChatMessageMutation,
      SendChatMessageMutationVariables
    >('SendChatMessageMutation', ({ input }) => {
      alert(`Message sent: ${input.body}`)

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

    return <ChatInput {...args} />
  },
}
