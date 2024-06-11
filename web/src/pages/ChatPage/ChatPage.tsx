import { Card, CardBody, CardFooter, Divider } from '@nextui-org/react'

import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import ChatInput from 'src/components/Chat/ChatInput/ChatInput'
import ChatMessagesCell from 'src/components/Chat/ChatMessagesCell'

const ChatPage = () => {
  const chatRoomId = '40'

  const { isAuthenticated } = useAuth()

  return (
    <>
      <Metadata title="Chat" description="Chat page" />

      <h1 className="mb-10">ChatPage</h1>

      <Card isFooterBlurred>
        <CardBody>
          <ChatMessagesCell chatRoomId={chatRoomId} />
        </CardBody>

        {isAuthenticated && (
          <>
            <Divider />
            <CardFooter className="bg-background/50">
              <ChatInput chatRoomId={chatRoomId} />
            </CardFooter>
          </>
        )}
      </Card>
    </>
  )
}

export default ChatPage
