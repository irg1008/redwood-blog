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

import Stream from './Stream'

const meta: Meta<typeof Stream> = {
  component: Stream,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Stream>

export const Primary: Story = {
  render: () => (
    <Stream
      stream={{
        id: 1,
        createdAt: '2021-08-06T00:00:00Z',
        recordingId: '1',
      }}
    />
  ),
}
