import type { Meta, StoryObj } from '@storybook/react'

import { Failure, Loading, Success } from './ChatMessagesCell'
import { standard } from './ChatMessagesCell.mock'

const meta: Meta<typeof Success> = {
  title: 'Cells/Chat/ChatMessagesCell',
  tags: ['autodocs'],
}

export default meta

export const success: StoryObj<typeof Success> = {
  render: (args) => {
    return Success ? <Success {...args} /> : <></>
  },
  args: standard(),
}

export const loading: StoryObj<typeof Loading> = {
  render: () => {
    return Loading ? <Loading /> : <></>
  },
}

export const empty: StoryObj<typeof Success> = {
  args: {
    chatMessages: [],
  },
  render: (args) => {
    return Success ? <Success {...args} /> : <></>
  },
}

export const failure: StoryObj<typeof Failure> = {
  render: (args) => {
    return Failure ? <Failure error={new Error('Oh no')} {...args} /> : <></>
  },
}
