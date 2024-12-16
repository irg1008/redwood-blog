import type { Meta, StoryObj } from '@storybook/react'

import ProfileSettingsPage from './ProfileSettingsPage'

const meta: Meta<typeof ProfileSettingsPage> = {
  component: ProfileSettingsPage,
}

export default meta

type Story = StoryObj<typeof ProfileSettingsPage>

export const Primary: Story = {}
