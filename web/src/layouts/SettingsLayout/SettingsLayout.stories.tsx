import type { Meta, StoryObj } from '@storybook/react'

import { Router } from '@redwoodjs/router'

import SettingLayout from './SettingsLayout'

const meta: Meta<typeof SettingLayout> = {
  component: SettingLayout,
}

export default meta

type Story = StoryObj<typeof SettingLayout>

export const Primary: Story = {
  render: () => <SettingLayout />,
  decorators: [
    (Story) => (
      <Router>
        <Story />
      </Router>
    ),
  ],
}
