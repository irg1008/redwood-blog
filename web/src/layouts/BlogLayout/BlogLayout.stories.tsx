import type { Meta, StoryObj } from '@storybook/react'

import BlogLayout from './BlogLayout'

const meta: Meta<typeof BlogLayout> = {
  component: BlogLayout,
}

export default meta

type Story = StoryObj<typeof BlogLayout>

export const loggedIn: Story = {
  render: (args) => {
    mockCurrentUser({
      id: 1,
      email: 'example@example.com',
      roles: 'moderator',
    })
    return <BlogLayout {...args} />
  },
}

export const loggedOut: Story = {
  render: (args) => {
    return <BlogLayout {...args} />
  },
}
