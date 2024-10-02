import { Metadata } from '@redwoodjs/web'

import StreamerCell from 'src/components/StreamerCell'

const ChatPage = ({ streamerId }: { streamerId: number }) => {
  return (
    <>
      <Metadata title="Streamer" description="Streamer page" />
      <StreamerCell id={streamerId} />
    </>
  )
}

export default ChatPage
