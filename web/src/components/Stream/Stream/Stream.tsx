import { PropsWithChildren } from 'react'

import { Stream } from 'types/graphql'

import ChatBox from 'src/components/Chat/ChatBox'
import StreamVideoCell from 'src/components/Stream/StreamVideoCell'
export type StreamerlessStream = Omit<Stream, 'streamer' | 'streamerLive'>

export type StreamComponentProps = {
  stream: StreamerlessStream
}

const StreamComponent = ({
  stream,
  children,
}: PropsWithChildren<StreamComponentProps>) => {
  return (
    <section className="flex grow">
      <div className="flex max-h-[calc(100dvh-4rem)] grow flex-col overflow-auto">
        <figure className="flex max-h-[80dvh]">
          <StreamVideoCell streamId={stream.id} />
        </figure>
        {children}
      </div>

      <article className="sticky right-0 top-0 flex w-80 shrink-0">
        <ChatBox streamId={stream.id} />
      </article>
    </section>
  )
}

export default StreamComponent
