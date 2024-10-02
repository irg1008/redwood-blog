import ChatBox from 'src/components/Chat/ChatBox'
import StreamVideoCell from 'src/components/Stream/StreamVideoCell'

const Stream = ({ streamId }: { streamId: number }) => {
  return (
    <>
      <div className="flex max-h-[85dvh] pe-80">
        <StreamVideoCell streamId={streamId} />
      </div>

      <aside className="absolute right-0 top-0 flex h-full w-80 pt-16">
        <ChatBox streamId={streamId} />
      </aside>
    </>
  )
}

export default Stream
