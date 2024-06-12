import { useEffect, useState } from 'react'

import { Avatar, cn } from '@nextui-org/react'
import { CatIcon } from 'lucide-react'
import type {
  ChatMessageInput,
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
import { registerFragment } from '@redwoodjs/web/apollo'

import { useAuth } from 'src/auth'

export type ChatMessagesCellProps = Pick<ChatMessageInput, 'chatRoomId'>

registerFragment(gql`
  fragment ChatMessageFragment on ChatMessage {
    id
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
  const { currentUser } = useAuth()
  const [messages, setMessages] = useState(chatMessages)

  useEffect(() => {
    if (messages.length < chatMessages.length) {
      setMessages(chatMessages)
    }
  }, [messages.length, chatMessages])

  useSubscription(CHAT_MESSAGES_SUB, {
    variables: { input: { chatRoomId } },
    onData: ({ data: result }) => {
      setMessages((previous) => [...previous, result.data.newChatMessage])
    },
  })

  if (messages.length === 0) {
    return <div>No messages yet</div>
  }

  return (
    <ul className="flex flex-col items-end gap-3">
      {messages.map((item) => (
        <li
          key={item.id}
          className={cn(
            'animate-appearance-in',
            'flex w-full flex-wrap gap-1 text-small'
          )}
        >
          <span
            className={cn(
              'inline-flex h-6',
              item.user.id === currentUser?.id && 'text-primary-600'
            )}
          >
            <Avatar
              color={item.user.id === currentUser?.id ? 'primary' : 'default'}
              radius="sm"
              showFallback
              fallback={<CatIcon className="size-3" />}
              className="me-2 h-5 w-5 text-tiny"
            />
            {item.user.displayName}:
          </span>
          <span className="[word-break:break-word]">{item.body}</span>
        </li>
      ))}
    </ul>
  )
}
