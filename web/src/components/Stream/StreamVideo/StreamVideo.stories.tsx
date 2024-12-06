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

import { standard } from '../StreamVideoCell/StreamVideoCell.mock'

import StreamVideo from './StreamVideo'

const meta: Meta<typeof StreamVideo> = {
  component: StreamVideo,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof StreamVideo>

export const Primary: Story = {
  render: () => <StreamVideo {...standard().stream} />,
}
