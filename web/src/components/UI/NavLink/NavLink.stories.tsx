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

import NavLink from './NavLink'

const meta: Meta<typeof NavLink> = {
  component: NavLink,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof NavLink>

export const Primary: Story = {}
