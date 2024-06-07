import type { Meta, StoryObj } from '@storybook/react'

import ConfirmCodeForm from './ConfirmCodeForm'

const meta: Meta<typeof ConfirmCodeForm> = {
  component: ConfirmCodeForm,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ConfirmCodeForm>

export const Primary: Story = {}
