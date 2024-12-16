import { RefObject, useEffect, useRef } from 'react'

import Hls, { HlsConfig, Level } from 'hls.js'
import { clearInterval, setInterval } from 'worker-timers'
import { create } from 'zustand'

const AUTO_LEVEL = -1
const AUTOPLAY = true
const INITIAL_MUTED = true
const INITIAL_VOLUME = INITIAL_MUTED ? 0 : 1

const hlsConfig: Partial<HlsConfig> = {
  enableWorker: true,
  lowLatencyMode: true,
  backBufferLength: 90,
  autoStartLoad: true,
  startLevel: 0, // Highest quality
  liveSyncDuration: -1000, // Delay. Negative value to squeeze the buffer
  maxBufferLength: 15,
  maxMaxBufferLength: 60,
}

type HlsState = {
  qualities: Level[]
  currentQuality?: Level
  autoEnabled: boolean
  currentSpeed: number
  timesLoading: number
  loading: boolean
  paused: boolean
  volume: number
  muted: boolean
  latency: number
  fullscreen: boolean
  pictureInPicture: boolean
  setQualities: (qualities: Level[]) => void
  setCurrentQuality: (quality: Level) => void
  setAutoEnabled: (enabled: boolean) => void
  setCurrentSpeed: (speed: number) => void
  setLoading: (loading: boolean) => void
  setPaused: (paused: boolean) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  setLatency: (latency: number) => void
  setFullscreen: (fullscreen: boolean) => void
  setPictureInPicture: (pictureInPicture: boolean) => void
}

const useHlsStore = create<HlsState>((set, get) => ({
  qualities: [],
  autoEnabled: true,
  currentSpeed: 1,
  loading: false,
  timesLoading: 0,
  paused: !AUTOPLAY,
  volume: INITIAL_VOLUME,
  muted: INITIAL_MUTED,
  latency: 0,
  fullscreen: false,
  pictureInPicture: false,
  setQualities: (qualities) => set({ qualities }),
  setAutoEnabled: (autoEnabled) => set({ autoEnabled }),
  setCurrentQuality: (currentQuality) => set({ currentQuality }),
  setCurrentSpeed: (currentSpeed) => set({ currentSpeed }),
  setLoading: (loading) =>
    set({ loading, timesLoading: get().timesLoading + 1 }),
  setPaused: (paused) => set({ paused }),
  setVolume: (volume) => set({ volume, muted: volume === 0 }),
  setMuted: (muted) => set({ muted }),
  setLatency: (latency) => set({ latency }),
  setFullscreen: (fullscreen) => set({ fullscreen }),
  setPictureInPicture: (pictureInPicture) => set({ pictureInPicture }),
}))

export const useHls = (streamUrl: string) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls>(new Hls(hlsConfig))

  const {
    qualities,
    currentQuality,
    autoEnabled,
    currentSpeed,
    paused,
    volume,
    latency,
    muted,
    loading,
    fullscreen,
    pictureInPicture,
    timesLoading,
    setQualities,
    setAutoEnabled,
    setLatency,
    setCurrentQuality,
    setPaused,
    setLoading,
    setCurrentSpeed,
    setMuted,
    setVolume,
    setFullscreen,
    setPictureInPicture,
  } = useHlsStore()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const hls = hlsRef.current

    video.playsInline = true
    video.muted = INITIAL_MUTED
    video.autoplay = AUTOPLAY
    video.volume = INITIAL_VOLUME
    video.crossOrigin = 'anonymous'
    video.loop = false
    video.preload = 'auto'

    if (!Hls.isSupported()) {
      video.src = streamUrl
      return
    }

    hls.attachMedia(video)

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(streamUrl)
    })

    hls.on(Hls.Events.MANIFEST_PARSED, (_e, data) => {
      hls.levels.sort((a, b) => b.height - a.height)
      setQualities(data.levels)
      setAutoEnabled(hls.autoLevelEnabled)
      setLatency(hls.latency)

      play()
    })

    hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
      setCurrentQuality(hls.levels[data.level])
      seekLive()
    })

    hls.on(Hls.Events.ERROR, (_event, err) => {
      console.error(err)
    })

    video.addEventListener('waiting', () => {
      setLoading(true)
    })

    video.addEventListener('playing', () => {
      setPaused(false)
      setLoading(false)
    })

    video.addEventListener('seeking', () => {
      setLoading(true)
    })

    video.addEventListener('seeked', () => {
      setLoading(false)
    })

    video.addEventListener('stalled', () => {
      setLoading(true)
    })

    video.addEventListener('play', () => {
      setPaused(false)
      seekLive()
    })

    video.addEventListener('pause', () => {
      setPaused(true)
    })

    video.addEventListener('leavepictureinpicture', () => {
      setPictureInPicture(false)
    })

    video.addEventListener('enterpictureinpicture', () => {
      setPictureInPicture(true)
    })

    document.addEventListener('fullscreenchange', () => {
      setFullscreen(!!document.fullscreenElement)
    })

    const latencyUpdater = setInterval(() => {
      setLatency(hls.latency)
    }, 1000)

    return () => {
      hls.destroy()
      clearInterval(latencyUpdater)
    }
  }, [
    streamUrl,
    setQualities,
    setAutoEnabled,
    setLatency,
    setCurrentQuality,
    setPaused,
    setLoading,
    setFullscreen,
    setMuted,
    setVolume,
    setPictureInPicture,
  ])

  const seekLive = () => {
    const livePosition = hlsRef.current?.liveSyncPosition
    const video = videoRef.current
    if (!livePosition || !video) return

    video.currentTime = Math.round(livePosition)
  }

  const setSelectedLevel = (level: number) => {
    const hls = hlsRef.current
    if (!hls) return

    hls.currentLevel = level
    setAutoEnabled(hls.autoLevelEnabled)
  }

  const changePlaybackSpeed = (speed: number) => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = speed
    setCurrentSpeed(speed)
  }

  const play = () => {
    videoRef.current?.play()
  }

  const pause = () => {
    videoRef.current?.pause()
  }

  const togglePlay = () => {
    return paused ? play() : pause()
  }

  const togglePictureInPicture = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture()
    } else {
      videoRef.current?.requestPictureInPicture()
      document.exitFullscreen()
    }
  }

  const toggleFullscreen = <E extends HTMLElement | null>(
    altRef?: RefObject<E>
  ) => {
    const ref = altRef ?? videoRef
    if (!ref.current) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      ref.current.requestFullscreen()
      document.exitPictureInPicture()
    }
  }

  const mute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = true
    setMuted(true)
  }

  const unmute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = false
    setMuted(false)

    if (volume === 0) {
      changeVolume(0.2)
    }
  }

  const toggleMute = () => {
    return muted ? unmute() : mute()
  }

  const changeVolume = (volume: number) => {
    const video = videoRef.current
    if (!video) return

    video.muted = volume === 0
    video.volume = volume
    setVolume(volume)
  }

  return {
    autoLevel: AUTO_LEVEL,
    autoEnabled,
    selectedLevel: autoEnabled ? AUTO_LEVEL : hlsRef.current!.currentLevel,
    videoRef,
    qualities,
    currentQuality,
    currentSpeed,
    loading,
    timesLoading,
    paused,
    volume,
    latency,
    playingDate: hlsRef.current?.playingDate,
    muted,
    isHlsSupported: Hls.isSupported(),
    fullscreen,
    pictureInPicture,
    setAutoEnabled,
    seekLive,
    setSelectedLevel,
    changePlaybackSpeed,
    play,
    pause,
    togglePlay,
    toggleMute,
    togglePictureInPicture,
    toggleFullscreen,
    mute,
    unmute,
    changeVolume,
  }
}
