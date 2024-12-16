import type { Meta, StoryObj } from '@storybook/react'
import {
  CreateStreamKeyMutation,
  CreateStreamKeyMutationVariables,
} from 'types/graphql'

import StreamerSettingsPage from './StreamerSettingsPage'

const meta: Meta<typeof StreamerSettingsPage> = {
  component: StreamerSettingsPage,
}

export default meta

type Story = StoryObj<typeof StreamerSettingsPage>

export const LoggedOut: Story = {
  render: () => {
    mockCurrentUser(null)

    return <StreamerSettingsPage />
  },
}

export const LoggedIn: Story = {
  render: () => {
    mockCurrentUser({
      id: 1,
      email: 'user@email.com',
      roles: 'user',
    })

    mockGraphQLMutation<
      CreateStreamKeyMutation,
      CreateStreamKeyMutationVariables
    >('CreateStreamKeyMutation', (_variables) => {
      return {
        createStreamKey: {
          streamKey: '1234567890',
        },
      }
    })

    return <StreamerSettingsPage />
  },
}
