import { useState } from 'react'

import { cn } from '@nextui-org/react'
import type {
  ChatMessagesQuery,
  ChatMessagesQueryVariables,
  ChatMessagesSub,
  ChatMessagesSubVariables,
} from 'types/graphql'

import {
  useSubscription,
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
} from '@redwoodjs/web'
import { registerFragment } from '@redwoodjs/web/dist/apollo'

import { useAuth } from 'src/auth'

type ChatMessagesCellProps = {
  chatRoomId: string
}

registerFragment(gql`
  fragment ChatMessageFragment on ChatMessage {
    body
    createdAt
    user {
      id
      displayName
    }
  }
`)

export const QUERY: TypedDocumentNode<
  ChatMessagesQuery,
  ChatMessagesQueryVariables
> = gql`
  query ChatMessagesQuery($chatRoomId: String!) {
    chatMessages(chatRoomId: $chatRoomId) {
      ...ChatMessageFragment
    }
  }
`

export const CHAT_MESSAGES_SUB: TypedDocumentNode<
  ChatMessagesSub,
  ChatMessagesSubVariables
> = gql`
  subscription ChatMessagesSub($input: ChatSubscriptionInput!) {
    newChatMessage: chatRoom(input: $input) {
      ...ChatMessageFragment
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="text-danger">Error: {error?.message}</div>
)

export const Success = ({
  chatMessages,
  chatRoomId,
}: CellSuccessProps<ChatMessagesQuery> & ChatMessagesCellProps) => {
  const [messages, setMessages] = useState(chatMessages)

  const { currentUser } = useAuth()

  useSubscription(CHAT_MESSAGES_SUB, {
    variables: { input: { chatRoomId } },
    onData: ({ data: result }) => {
      setMessages((previous) => previous.concat(result.data.newChatMessage))
    },
    shouldResubscribe: true,
  })

  if (chatMessages.length === 0) {
    return <div>No messages yet</div>
  }

  return (
    <ul className="flex max-h-[600px] flex-col-reverse gap-5 overflow-auto p-2">
      {messages.toReversed().map((item) => (
        <li
          key={item.createdAt}
          className={cn(
            'animate-appearance-in',
            'flex w-fit flex-col gap-1 rounded-lg bg-primary-600 p-4 text-primary-50',
            item.user.id === currentUser?.id &&
              'self-end bg-secondary-600 text-secondary-50'
          )}
        >
          <small>{item.user.displayName}</small>
          <strong>{item.body}</strong>
          <small className="self-end opacity-50">
            {new Date(item.createdAt).toLocaleString()}
          </small>
        </li>
      ))}
    </ul>
  )
}
