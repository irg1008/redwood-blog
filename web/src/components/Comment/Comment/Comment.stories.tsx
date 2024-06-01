import type { Meta, StoryObj } from '@storybook/react'

import Comment from './Comment'

const meta: Meta<typeof Comment> = {
  component: Comment,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Comment>

export const defaultView: Story = {
  args: {
    comment: {
      id: 1,
      postId: 1,
      name: 'John Doe',
      body: 'This is a comment',
      createdAt: '2021-07-01T00:00:00Z',
    },
  },
}

export const moderatorView: Story = {
  args: {
    comment: {
      id: 1,
      postId: 1,
      name: 'John Doe',
      body: 'This is a comment',
      createdAt: '2021-07-01T00:00:00Z',
    },
  },
  render: (args) => {
    mockCurrentUser({
      id: 1,
      email: 'moderator@gmail.com',
      roles: 'moderator',
    })
    return <Comment {...args} />
  },
}
