import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { MockSubscriptionLink } from '@apollo/client/testing'
import type { Decorator, Meta, StoryObj } from '@storybook/react'

import { Failure, Loading, Success } from './ChatMessagesCell'
import { standard } from './ChatMessagesCell.mock'

const meta: Meta = {
  title: 'Cells/Chat/ChatMessagesCell',
  tags: ['autodocs'],
}

export default meta

const subscriptionDecorator: Decorator = (Story) => {
  const link = new MockSubscriptionLink()
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({ addTypename: false }),
  })

  return (
    <ApolloProvider client={client}>
      <Story />
    </ApolloProvider>
  )
}

export const success: StoryObj<typeof Success> = {
  render: (args) => {
    return Success ? <Success {...standard()} {...args} /> : <></>
  },
  decorators: [subscriptionDecorator],
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
