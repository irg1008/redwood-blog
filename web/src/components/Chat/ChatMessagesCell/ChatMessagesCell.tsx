import { useEffect, useState } from 'react'

import { RatIcon } from 'lucide-react'
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

import ChatMessages from '../ChatMessages/ChatMessages'

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
      # FIXME: Storybook doesn't work when using fragment: https://github.com/redwoodjs/redwood/issues/10807
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

export const Loading = () => <div>Loading messages</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="text-danger">Error: {error?.message}</div>
)

export const Success = ({
  chatMessages,
  chatRoomId,
}: CellSuccessProps<ChatMessagesQuery> & ChatMessagesCellProps) => {
  const [messages, setMessages] = useState(chatMessages)
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    if (messages.length < chatMessages.length) {
      setMessages(chatMessages)
    }
  }, [messages.length, chatMessages])

  useSubscription<ChatMessagesSub, ChatMessagesSubVariables>(
    CHAT_MESSAGES_SUB,
    {
      variables: { input: { chatRoomId } },
      onData: ({ data: result }) => {
        setMessages((previous) => {
          if (!result.data) return previous
          if (previous.length >= 100) previous = previous.slice(1)
          return [...previous, result.data.newChatMessage]
        })
      },
    }
  )

  if (messages.length === 0) {
    return (
      <div className="grid h-full place-content-center place-items-center gap-2">
        <RatIcon className="size-16 text-primary-600" />
        {`It's so empty here`}
      </div>
    )
  }

  return <ChatMessages chatMessages={messages} />
}
