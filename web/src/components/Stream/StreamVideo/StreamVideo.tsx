import { useRef } from 'react'

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SelectItem,
  Slider,
  Spinner,
} from '@nextui-org/react'

import { useHls } from 'src/hooks/useHls'

type SteramVideoProps = {
  streamUrl: string
}

const StreamVideo = ({ streamUrl }: SteramVideoProps) => {
  const {
    autoEnabled,
    autoLevel,
    currentQuality,
    qualities,
    videoRef,
    selectedLevel,
    currentSpeed,
    loading,
    play,
    pause,
    paused,
    changePlaybackSpeed,
    seekLive,
    setSelectedLevel,
    volume,
    mute,
    unmute,
    changeVolume,
    toggleFullscreen,
    togglePictureInPicture,
    muted,
    latency,
    isHlsSupported,
  } = useHls(streamUrl)

  const containerRef = useRef<HTMLHeadingElement>(null)

  return (
    <>
      <div className="flex w-full flex-col" ref={containerRef}>
        <header className="relative flex h-full w-full">
          {loading && (
            <span className="absolute grid size-full place-content-center">
              <Spinner size="lg" />
            </span>
          )}

          <video ref={videoRef} className="mx-auto w-full">
            <track kind="captions" />
          </video>
        </header>
        Latency: {latency}
        <Button onClick={togglePictureInPicture}>
          Toggle Picture in Picture
        </Button>
        <Button onClick={() => toggleFullscreen(containerRef)}>
          Toggle Fullscreen
        </Button>
        Volume: {volume}
        <Slider
          aria-label="Volume"
          minValue={0}
          maxValue={1}
          step={0.01}
          size="lg"
          color="success"
          value={volume}
          onChange={(value) => {
            if (typeof value === 'number') changeVolume(value)
          }}
        />
        <Button onClick={muted ? unmute : mute}>
          {muted ? 'Unmute' : 'Mute'}
        </Button>
        <Button onClick={paused ? play : pause}>
          {paused ? 'Play' : 'Pause'}
        </Button>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">
              Resolución {currentQuality && `(${currentQuality.height}p)`}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Resolution selection"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[selectedLevel.toString()]}
            onSelectionChange={(keys) => {
              const newLevel = parseInt(Array.from(keys)[0].toString())
              setSelectedLevel(newLevel)
            }}
          >
            {[
              <DropdownItem key={autoLevel}>
                Auto{' '}
                {autoEnabled && currentQuality && `(${currentQuality.height}p)`}
              </DropdownItem>,
              ...qualities.map((quality, i) => (
                <SelectItem key={i}>
                  {quality.height}p {i === 0 ? '(Original)' : ''}
                </SelectItem>
              )),
            ]}
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered">
              Velocidad de reproducción {currentSpeed}x
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Playback speed selection"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[currentSpeed.toString()]}
            onSelectionChange={(keys) => {
              const newSpeed = parseFloat(Array.from(keys)[0].toString())
              changePlaybackSpeed(newSpeed)
            }}
          >
            {[0.25, 0.5, 1, 1.5, 2].map((speed) => (
              <DropdownItem key={speed}>{speed}x</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {isHlsSupported && <Button onClick={seekLive}>Seek live</Button>}
      </div>
    </>
  )
}

export default StreamVideo
