import { Metadata } from '@redwoodjs/web'

import ChatInput from 'src/components/Chat/ChatInput/ChatInput'
import ChatMessagesCell from 'src/components/Chat/ChatMessagesCell'

const ChatPage = () => {
  const chatRoomId = '42'

  return (
    <>
      <Metadata title="Chat" description="Chat page" />

      <section className="flex flex-col gap-4">
        <h1 className="mb-10">ChatPage</h1>

        <ChatInput chatRoomId={chatRoomId} />

        <hr />
        <ChatMessagesCell chatRoomId={chatRoomId} />
      </section>
    </>
  )
}

export default ChatPage
