import { useEffect, useState } from 'react'

import { RatIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type {
  ChatMessageFragment,
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

import Spinner from 'src/components/UI/Spinner/Spinner'

import ChatMessages from '../ChatMessages/ChatMessages'

export type ChatMessagesCellProps = Pick<ChatMessageInput, 'streamId'>

registerFragment(gql`
  fragment ChatMessageFragment on ChatMessage {
    id
    body
    createdAt
    user {
      id
      email
    }
  }
`)

export const QUERY: TypedDocumentNode<
  ChatMessagesQuery,
  ChatMessagesQueryVariables
> = gql`
  query ChatMessagesQuery($streamId: Int!) {
    chatMessages(streamId: $streamId) {
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

export const Loading = () => (
  <div className="grid h-full place-content-center place-items-center p-12">
    <Spinner />
  </div>
)

export const Failure = ({ error }: CellFailureProps) => {
  const { t } = useTranslation()
  return (
    <div className="text-danger">
      {t('chat.error')}
      {error && t('common.error', { error: error.message })}
    </div>
  )
}

const pushToQueue = (
  queue: ChatMessageFragment[],
  limit: number,
  ...messages: ChatMessageFragment[]
) => {
  const elementsToRemove = queue.length + messages.length - limit
  if (elementsToRemove > 0) queue.splice(0, elementsToRemove)

  queue.push(...messages)
  return queue
}

export const Success = ({
  chatMessages,
  streamId,
}: CellSuccessProps<ChatMessagesQuery> & ChatMessagesCellProps) => {
  const { t } = useTranslation()

  const [messages, setMessages] = useState(chatMessages)
  const [isScrollingAway, setIsScrolling] = useState(false)
  const messageLimit = isScrollingAway ? 500 : 200

  const injectNewMessages = (...messages: ChatMessageFragment[]) => {
    setMessages((previous) =>
      pushToQueue([...previous], messageLimit, ...messages)
    )
  }

  useSubscription<ChatMessagesSub, ChatMessagesSubVariables>(
    CHAT_MESSAGES_SUB,
    {
      variables: { input: { streamId } },
      onData: ({ data: result }) => {
        if (!result.data) return
        const { newChatMessage } = result.data
        injectNewMessages(newChatMessage)
      },
    }
  )

  useEffect(() => {
    if (messages.length < chatMessages.length) {
      setMessages(chatMessages)
    }
  }, [messages.length, chatMessages])

  if (messages.length === 0) {
    return (
      <div className="grid h-full place-content-center place-items-center gap-2">
        <RatIcon className="size-16 text-primary-600" />
        {t('chat.empty')}
      </div>
    )
  }

  return <ChatMessages chatMessages={messages} onScrollAway={setIsScrolling} />
}
