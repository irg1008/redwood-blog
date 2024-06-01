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
import {
  CreateCommentMutation,
  CreateCommentMutationVariables,
} from 'types/graphql'

import CommentForm from './CommentForm'

const meta: Meta<typeof CommentForm> = {
  component: CommentForm,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof CommentForm>

export const Primary: Story = {
  render: (args) => {
    mockGraphQLMutation<CreateCommentMutation, CreateCommentMutationVariables>(
      'CreateCommentMutation',
      (variables, { ctx }) => {
        const id = Math.floor(Math.random() * 1000)
        ctx.delay(1000)
        return {
          createComment: {
            id,
            name: variables.input.name,
            body: variables.input.body,
            createdAt: new Date().toISOString(),
          },
        }
      }
    )

    return <CommentForm {...args} />
  },
}
