import { UIEventHandler, useState } from 'react'

import { Avatar, cn } from '@nextui-org/react'
import { CatIcon } from 'lucide-react'
import { ChatMessageFragment } from 'types/graphql'

import { useAuth } from 'src/auth'

type ChatMessagesProps = {
  chatMessages: ChatMessageFragment[]
}

const ChatMessages = ({ chatMessages }: ChatMessagesProps) => {
  const { currentUser } = useAuth()
  const [scrollingAway, setScrollingAway] = useState(false)

  const onContainerScroll: UIEventHandler = (e) => {
    const { scrollTop } = e.target as HTMLDivElement
    setScrollingAway(scrollTop > 0)
  }

  return (
    <div
      className="flex flex-col-reverse overflow-auto p-3"
      onScroll={onContainerScroll}
    >
      {scrollingAway && (
        <aside className="sticky bottom-0 w-full">Scrolleando</aside>
      )}
      <ul className="flex flex-col items-end gap-3">
        {chatMessages.map((item) => (
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
    </div>
  )
}

export default ChatMessages
