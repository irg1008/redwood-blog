import { useEffect, useRef, useState } from 'react'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SelectItem,
} from '@nextui-org/react'
import Hls, { Level } from 'hls.js'
import type { ReadStreamQuery, ReadStreamQueryVariables } from 'types/graphql'

import {
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
} from '@redwoodjs/web'

const hls = new Hls({
  debug: false,
  enableWorker: true,
  lowLatencyMode: true,
})

const AUTO_LEVEL = -1

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

export const Success = ({
  stream,
}: CellSuccessProps<ReadStreamQuery, ReadStreamQueryVariables>) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [qualities, setQualities] = useState<Level[]>([])
  const [currentQuality, setCurrentQuality] = useState<Level>()
  const [autoEnabled, setAutoEnabled] = useState(true)

  useEffect(() => {
    if (!videoRef.current) return

    if (!Hls.isSupported()) {
      videoRef.current.src = stream.streamUrl
      return
    }

    hls.attachMedia(videoRef.current)

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(stream.streamUrl)
    })

    hls.on(Hls.Events.MANIFEST_LOADED, () => {
      videoRef.current?.play()
      hls.levels.sort((a, b) => b.height - a.height)
      setQualities(hls.levels)
      setAutoEnabled(hls.autoLevelEnabled)
    })

    hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
      setCurrentQuality(hls.levels[data.level])
      seekLive()
    })

    hls.on(Hls.Events.ERROR, (_event, err) => {
      console.error(err)
    })
  }, [stream.streamUrl])

  const seekLive = () => {
    if (videoRef.current && hls.liveSyncPosition) {
      videoRef.current.currentTime = hls.liveSyncPosition
    }
  }

  return (
    <>
      <div className="flex w-full flex-col">
        <header className="flex h-full w-full">
          <video
            autoPlay
            playsInline
            muted
            ref={videoRef}
            controls={false}
            className="mx-auto w-full"
          >
            <track kind="captions" />
          </video>
        </header>

        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="capitalize">
              Resolución {currentQuality && `(${currentQuality.height}p)`}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Resolution selection"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[
              autoEnabled ? AUTO_LEVEL.toString() : hls.currentLevel.toString(),
            ]}
            onSelectionChange={(keys) => {
              const newLevel = parseInt(Array.from(keys)[0].toString())
              hls.currentLevel = newLevel
              setAutoEnabled(hls.autoLevelEnabled)
            }}
          >
            {[
              <DropdownItem key={AUTO_LEVEL}>
                Auto{' '}
                {autoEnabled && currentQuality && `(${currentQuality.height}p)`}
              </DropdownItem>,
              ...qualities.map((quality, i) => (
                <SelectItem key={i}>{quality.height}p</SelectItem>
              )),
            ]}
          </DropdownMenu>
        </Dropdown>

        {Hls.isSupported() && <Button onClick={seekLive}>Seek live</Button>}
      </div>
    </>
  )
}
