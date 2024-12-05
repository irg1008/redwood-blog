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

import ChatMessages from './ChatMessages'

const meta: Meta<typeof ChatMessages> = {
  component: ChatMessages,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ChatMessages>

export const Primary: Story = {
  args: {
    chatMessages: Array.from({ length: 50 }, (_, index) => ({
      body: `Message ${index + 1}`,
      createdAt: new Date(2021, 9, 1, 12, 0, 0).toISOString(),
      id: `${index + 1}`,
      user: {
        email: `User ${(index % 5) + 1}`, // Cycle through 5 different users
        id: (index % 5) + 1,
      },
    })),
  },

  render(args) {
    mockCurrentUser({
      id: 1,
      email: 'user@email.com',
      roles: 'user',
    })

    return <ChatMessages {...args} />
  },
}
