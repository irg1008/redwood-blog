import { useCallback, useEffect, useRef, useState } from 'react'

import { Avatar, Button, cn } from '@nextui-org/react'
import { ArrowDownIcon, CatIcon } from 'lucide-react'
import { ChatMessageFragment } from 'types/graphql'

import { useAuth } from 'src/lib/auth'

type ChatMessagesProps = {
  chatMessages: ChatMessageFragment[]
  scrollOffset?: number
  onScrollAway?: (scrollingAway: boolean) => void
}

const ChatMessages = ({
  chatMessages,
  scrollOffset = 0,
  onScrollAway,
}: ChatMessagesProps) => {
  const { currentUser } = useAuth()
  const [scrollingAway, setScrollingAway] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const onContainerScroll = () => {
    if (!containerRef.current) return
    const { scrollHeight, scrollTop, offsetHeight } = containerRef.current

    const scrollThreshold = scrollHeight - offsetHeight - scrollOffset
    const isScrollingAway = scrollTop < scrollThreshold
    if (scrollingAway === isScrollingAway) return

    setScrollingAway(isScrollingAway)
    onScrollAway?.(isScrollingAway)
  }

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return

    const { scrollHeight, offsetHeight } = containerRef.current
    containerRef.current.scrollTo({
      top: scrollHeight - offsetHeight,
    })
  }, [])

  useEffect(() => {
    if (!scrollingAway) scrollToBottom()
  }, [chatMessages, scrollingAway, scrollToBottom])

  return (
    <div
      className={cn(
        'h-full overflow-auto p-3',
        scrollingAway ? 'flex-col-reverse' : ''
      )}
      onScroll={onContainerScroll}
      ref={containerRef}
    >
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
              {item.user.email}:
            </span>
            <span className="[word-break:break-word]">{item.body}</span>
          </li>
        ))}
      </ul>

      {scrollingAway && (
        <aside className="fixed bottom-20 right-6 flex p-2">
          <Button className="w-full" isIconOnly onClick={scrollToBottom}>
            <ArrowDownIcon />
          </Button>
        </aside>
      )}
    </div>
  )
}

export default ChatMessages
