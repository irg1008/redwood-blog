import { useEffect, useRef } from 'react'

import Hls from 'hls.js'
import type { ReadStreamQuery, ReadStreamQueryVariables } from 'types/graphql'

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<
  ReadStreamQuery,
  ReadStreamQueryVariables
> = gql`
  query ReadStreamQuery($streamId: Int!) {
    stream: readStream(streamId: $streamId) {
      streamUrl
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<ReadStreamQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

const hls = new Hls({
  debug: false,
  enableWorker: true,
  lowLatencyMode: true,
})

export const Success = ({
  stream,
}: CellSuccessProps<ReadStreamQuery, ReadStreamQueryVariables>) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    console.log('mounting')
    if (Hls.isSupported() && videoRef.current) {
      videoRef.current.setAttribute('webkit-playsinline', 'true')
      hls.attachMedia(videoRef.current)

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(stream.streamUrl)
      })

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play()

        console.log(hls.levels)
      })

      hls.on(Hls.Events.ERROR, (err) => {
        console.error(err)
      })
    }
  }, [stream.streamUrl])

  return (
    <div className="flex w-full flex-col">
      <header className="flex h-full w-full">
        <video
          autoPlay
          muted
          playsInline
          ref={videoRef}
          controls
          className="mx-auto w-full"
        >
          <track kind="captions" />
        </video>
      </header>
      {/* {hls.levels.map((level) => (
        <>{JSON.stringify(level)}</>
      ))} */}
      {/* Quality:
      <Button>Auto</Button>
      <Button>1080p</Button>
      <Button>720p</Button>
      <Button>480p</Button>
      <Button>360p</Button>
      <Button>160p</Button> */}
    </div>
  )
}
