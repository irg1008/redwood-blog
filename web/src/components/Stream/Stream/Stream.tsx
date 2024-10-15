import { Stream } from 'types/graphql'

import ChatBox from 'src/components/Chat/ChatBox'
import StreamVideoCell from 'src/components/Stream/StreamVideoCell'
export type StreamerlessStream = Omit<Stream, 'streamer' | 'streamerLive'>

export type StreamComponentProps = {
  stream: StreamerlessStream
}

const StreamComponent = ({ stream }: { stream: StreamerlessStream }) => {
  return (
    <>
      <div className="flex max-h-[80dvh] pe-80">
        <StreamVideoCell streamId={stream.id} />
      </div>

      <aside className="absolute right-0 top-0 flex h-full w-80 pt-16">
        <ChatBox streamId={stream.id} />
      </aside>
    </>
  )
}

export default StreamComponent
