import { Card, CardFooter, Divider } from '@nextui-org/react'

import { useAuth } from 'src/lib/auth'

import ChatInput from '../ChatInput/ChatInput'
import ChatMessagesCell, { ChatMessagesCellProps } from '../ChatMessagesCell'

const ChatBox = ({ streamId }: ChatMessagesCellProps) => {
  const { isAuthenticated } = useAuth()

  return (
    <Card isFooterBlurred className="w-full" radius="none">
      <ChatMessagesCell streamId={streamId} />

      {isAuthenticated && (
        <>
          <Divider />
          <CardFooter className="bg-background/50s shrink-0 p-2">
            <ChatInput streamId={streamId} />
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default ChatBox
