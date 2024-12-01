import { useMemo, useRef, useState } from 'react'

import {
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Slider,
  Spinner,
  Tooltip,
} from '@nextui-org/react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  FastForwardIcon,
  GaugeIcon,
  HourglassIcon,
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PictureInPicture2Icon,
  PictureInPictureIcon,
  PlayIcon,
  RabbitIcon,
  Settings2Icon,
  SettingsIcon,
  SnailIcon,
  TrendingDownIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useHls } from 'src/hooks/useHls'

type SteramVideoProps = {
  streamUrl: string
  thumbnailUrl: string
}

const StreamVideo = ({ streamUrl, thumbnailUrl }: SteramVideoProps) => {
  const { t } = useTranslation()

  const hls = useHls(streamUrl)
  const containerRef = useRef<HTMLHeadingElement>(null)

  const toggleFullscreen = () => hls.toggleFullscreen(containerRef)
  const iconClasses = 'size-5 transition-transform group-hover:scale-105'
  const menuIconClasses = `${iconClasses} text-default-400`

  const [settingsOpened, setSettingsOpened] = useState(false)

  const [currentMenu, setCurrentMenu] = useState<
    'base' | 'qualities' | 'playRate' | 'stats'
  >('base')

  const menuComponent = useMemo(() => {
    switch (currentMenu) {
      case 'base': {
        return (
          <DropdownMenu
            key="base"
            aria-label={t('stream-player.toolbar.settings.aria')}
            variant="flat"
          >
            <DropdownSection showDivider>
              <DropdownItem
                startContent={<XIcon className={menuIconClasses} />}
              >
                {t('stream-player.toolbar.close')}
              </DropdownItem>
            </DropdownSection>
            <DropdownItem
              onClick={() => setCurrentMenu('qualities')}
              closeOnSelect={false}
              startContent={<Settings2Icon className={menuIconClasses} />}
              endContent={
                <span className="text-default-400">
                  {hls.currentQuality && `${hls.currentQuality.height}p`}
                </span>
              }
            >
              {t('stream-player.toolbar.settings.resolution')}
            </DropdownItem>
            <DropdownItem
              onClick={() => setCurrentMenu('playRate')}
              closeOnSelect={false}
              startContent={
                hls.currentSpeed < 1 ? (
                  <SnailIcon className={menuIconClasses} />
                ) : hls.currentSpeed > 1 ? (
                  <RabbitIcon className={menuIconClasses} />
                ) : (
                  <GaugeIcon className={menuIconClasses} />
                )
              }
              endContent={
                <span className="text-default-400">{hls.currentSpeed}x</span>
              }
            >
              {t('stream-player.toolbar.settings.playback-speed')}
            </DropdownItem>
            <DropdownItem
              onClick={() => setCurrentMenu('stats')}
              closeOnSelect={false}
              startContent={<HourglassIcon className={menuIconClasses} />}
            >
              {t('stream-player.toolbar.settings.stats')}
            </DropdownItem>
            <DropdownItem
              onClick={hls.seekLive}
              startContent={<FastForwardIcon className={menuIconClasses} />}
              className={cn(!hls.isHlsSupported && 'hidden')}
            >
              {t('stream-player.toolbar.settings.seek-live')}
            </DropdownItem>
          </DropdownMenu>
        )
      }

      case 'qualities': {
        return (
          <DropdownMenu
            key="qualities"
            aria-label={t('stream-player.toolbar.settings.resolution')}
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[hls.selectedLevel.toString()]}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0]
              const newLevel = parseInt(key.toString())
              if (isNaN(newLevel)) return
              hls.setSelectedLevel(newLevel)
            }}
          >
            <DropdownSection showDivider>
              <DropdownItem
                onClick={() => setCurrentMenu('base')}
                closeOnSelect={false}
                startContent={<ArrowLeft className={menuIconClasses} />}
              >
                {t('stream-player.toolbar.settings.back')}
              </DropdownItem>
            </DropdownSection>
            <DropdownSection>
              {[
                <DropdownItem key={hls.autoLevel}>
                  {t('stream-player.auto')}{' '}
                  {hls.autoEnabled &&
                    hls.currentQuality &&
                    `(${hls.currentQuality.height}p)`}
                </DropdownItem>,
                ...hls.qualities.map((quality, i) => (
                  <DropdownItem key={i}>{quality.height}p</DropdownItem>
                )),
              ]}
            </DropdownSection>
          </DropdownMenu>
        )
      }

      case 'playRate': {
        return (
          <DropdownMenu
            key="playRate"
            aria-label={t('stream-player.toolbar.settings.playback-speed')}
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[hls.currentSpeed.toString()]}
            onSelectionChange={(keys) => {
              const key = Array.from(keys)[0]
              const newSpeed = parseFloat(key.toString())
              if (isNaN(newSpeed)) return
              hls.changePlaybackSpeed(newSpeed)
            }}
          >
            <DropdownSection showDivider>
              <DropdownItem
                onClick={() => setCurrentMenu('base')}
                closeOnSelect={false}
                startContent={<ArrowLeft className={menuIconClasses} />}
              >
                {t('stream-player.toolbar.settings.back')}
              </DropdownItem>
            </DropdownSection>
            <DropdownSection>
              {[0.25, 0.5, 1, 1.5, 2].map((speed) => (
                <DropdownItem key={speed}>{speed}x</DropdownItem>
              ))}
            </DropdownSection>
          </DropdownMenu>
        )
      }

      case 'stats': {
        return (
          <DropdownMenu
            as={motion.ul}
            key="stats"
            aria-label={t('stream-player.toolbar.settings.stats')}
            variant="flat"
          >
            <DropdownSection showDivider>
              <DropdownItem
                onClick={() => setCurrentMenu('base')}
                closeOnSelect={false}
                startContent={<ArrowLeft className={menuIconClasses} />}
              >
                {t('stream-player.toolbar.settings.back')}
              </DropdownItem>
            </DropdownSection>
            <DropdownItem
              isReadOnly
              startContent={<TrendingDownIcon className={menuIconClasses} />}
              endContent={
                <span className="text-default-400">
                  {hls.latency.toFixed(2)}s
                </span>
              }
            >
              {t('stream-player.latency')}
            </DropdownItem>
          </DropdownMenu>
        )
      }
    }
  }, [currentMenu, hls, menuIconClasses, t])

  return (
    <>
      TimesLoading: {hls.timesLoading}
      <div className="flex max-h-full w-full flex-col">
        <section
          className="group/player relative flex overflow-hidden"
          ref={containerRef}
        >
          <video
            ref={hls.videoRef}
            poster={thumbnailUrl}
            className="mx-auto w-full"
            onDoubleClick={toggleFullscreen}
          >
            <track kind="captions" />
          </video>

          {hls.loading && (
            <span className="absolute grid size-full place-content-center">
              <Spinner size="lg" />
            </span>
          )}

          <span
            className={cn(
              'pointer-events-none absolute grid size-full place-content-center',
              hls.loading && 'opacity-0'
            )}
          >
            {hls.paused ? (
              <PauseIcon className="size-10 animate-drip-expand-hold opacity-0" />
            ) : (
              <PlayIcon className="size-10 animate-drip-expand-hold opacity-0" />
            )}
          </span>

          <footer
            className={cn(
              'absolute bottom-0 left-0 flex min-h-5 w-full translate-y-full items-center justify-between bg-gradient-to-b from-transparent via-background/70 to-background/80 px-2 py-1 transition-transform group-hover/player:translate-y-0',
              settingsOpened && 'translate-y-0',
              hls.loading && 'pointer-events-none'
            )}
          >
            <div className="flex items-center">
              <Button
                isIconOnly
                size="sm"
                aria-label="Play/Pause"
                onClick={hls.togglePlay}
                variant="light"
              >
                {hls.paused ? (
                  <PlayIcon className={iconClasses} />
                ) : (
                  <PauseIcon className={iconClasses} />
                )}
              </Button>

              <div className="group/volume flex min-w-40 items-center gap-1">
                <Button
                  isIconOnly
                  size="sm"
                  aria-label={
                    hls.muted
                      ? t('stream-player.toolbar.volume.mute')
                      : t('stream-player.toolbar.volume.unmute')
                  }
                  onClick={hls.toggleMute}
                  variant="light"
                >
                  {hls.muted ? (
                    <VolumeXIcon className={iconClasses} />
                  ) : hls.volume < 0.5 ? (
                    <Volume1Icon className={iconClasses} />
                  ) : (
                    <Volume2Icon className={iconClasses} />
                  )}
                </Button>

                <Slider
                  hideValue
                  className="opacity-0 transition-opacity group-hover/volume:opacity-100"
                  aria-label={t('stream-player.toolbar.volume.aria')}
                  minValue={0}
                  maxValue={1}
                  step={0.01}
                  size="sm"
                  color="foreground"
                  value={hls.muted ? 0 : hls.volume}
                  onChange={(value) => {
                    if (typeof value === 'number') hls.changeVolume(value)
                  }}
                />
              </div>
            </div>

            <aside>
              <Dropdown
                portalContainer={containerRef.current ?? document.body}
                placement="top-end"
                isOpen={settingsOpened}
                onOpenChange={setSettingsOpened}
                onClose={() => setCurrentMenu('base')}
              >
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <SettingsIcon className={iconClasses} />
                  </Button>
                </DropdownTrigger>
                {menuComponent}
              </Dropdown>

              <Tooltip
                content={
                  hls.pictureInPicture
                    ? t('stream-player.toolbar.picture-in-picture.exit')
                    : t('stream-player.toolbar.picture-in-picture.enter')
                }
              >
                <Button
                  isIconOnly
                  size="sm"
                  aria-label={t(
                    'stream-player.toolbar.picture-in-picture.aria'
                  )}
                  onClick={hls.togglePictureInPicture}
                  variant="light"
                >
                  {hls.pictureInPicture ? (
                    <PictureInPicture2Icon className={iconClasses} />
                  ) : (
                    <PictureInPictureIcon className={iconClasses} />
                  )}
                </Button>
              </Tooltip>

              <Tooltip
                content={
                  hls.fullscreen
                    ? t('stream-player.toolbar.fullscreen.exit')
                    : t('stream-player.toolbar.fullscreen.enter')
                }
              >
                <Button
                  isIconOnly
                  size="sm"
                  aria-label={t('stream-player.toolbar.fullscreen.aria')}
                  onClick={toggleFullscreen}
                  variant="light"
                >
                  {hls.fullscreen ? (
                    <MinimizeIcon className={iconClasses} />
                  ) : (
                    <MaximizeIcon className={iconClasses} />
                  )}
                </Button>
              </Tooltip>
            </aside>
          </footer>
        </section>
      </div>
    </>
  )
}

export default StreamVideo
