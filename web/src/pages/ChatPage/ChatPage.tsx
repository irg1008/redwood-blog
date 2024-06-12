import { Metadata } from '@redwoodjs/web'

import ChatBox from 'src/components/Chat/ChatBox/ChatBox'
import { ChatMessagesCellProps } from 'src/components/Chat/ChatMessagesCell'

const ChatPage = ({ chatRoomId }: ChatMessagesCellProps) => {
  return (
    <>
      <Metadata title="Chat" description="Chat page" />

      <h1 className="mb-10">ChatPage</h1>

      <aside className="absolute right-0 top-0 flex h-full w-80 pt-16">
        <ChatBox chatRoomId={chatRoomId} />
      </aside>
    </>
  )
}

export default ChatPage
