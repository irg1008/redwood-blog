import type { Meta, StoryObj } from '@storybook/react'

import StreamerPage from './StreamerPage'

const meta: Meta<typeof StreamerPage> = {
  component: StreamerPage,
}

export default meta

type Story = StoryObj<typeof StreamerPage>

export const Primary: Story = {
  render: (args) => {
    mockCurrentUser({
      id: 1,
      email: 'User 1',
      roles: 'user',
    })

    return <StreamerPage {...args} />
  },
}
