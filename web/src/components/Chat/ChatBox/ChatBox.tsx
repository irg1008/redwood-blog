import { Card, CardBody, CardFooter, Divider } from '@nextui-org/react'

import { useAuth } from 'src/auth'

import ChatInput from '../ChatInput/ChatInput'
import ChatMessagesCell, { ChatMessagesCellProps } from '../ChatMessagesCell'

const ChatBox = ({ chatRoomId }: ChatMessagesCellProps) => {
  const { isAuthenticated } = useAuth()

  return (
    <Card isFooterBlurred className="w-full" radius="none">
      <CardBody className="flex-col-reverse overflow-auto">
        <ChatMessagesCell chatRoomId={chatRoomId} />
      </CardBody>

      {isAuthenticated && (
        <>
          <Divider />
          <CardFooter className="bg-background/50s shrink-0 p-2">
            <ChatInput chatRoomId={chatRoomId} />
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default ChatBox
