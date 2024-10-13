import { RefObject, useEffect, useRef, useState } from 'react'

import Hls, { Level } from 'hls.js'

const AUTO_LEVEL = -1
const AUTOPLAY = true
const INITIAL_MUTED = true

export const useHls = (streamUrl: string) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [qualities, setQualities] = useState<Level[]>([])
  const [currentQuality, setCurrentQuality] = useState<Level>()
  const [autoEnabled, setAutoEnabled] = useState(true)
  const [currentSpeed, setCurrentSpeed] = useState(1)
  const [loading, setLoading] = useState(true)
  const [paused, setPaused] = useState(!AUTOPLAY)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(INITIAL_MUTED)
  const [latency, setLatency] = useState(0)

  const hlsRef = useRef(
    new Hls({
      debug: true,
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
      autoStartLoad: true,
      startLevel: 0,
      liveSyncDuration: -2000, // Delay. Negative value to squeeze the buffer
      liveMaxLatencyDuration: 5_000, // Max delay until seek live
    })
  )

  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current
    const hls = hlsRef.current

    video.controls = false
    video.playsInline = true
    video.muted = INITIAL_MUTED
    video.autoplay = AUTOPLAY

    if (!Hls.isSupported()) {
      videoRef.current.src = streamUrl
      return
    }

    hls.attachMedia(videoRef.current)

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(streamUrl)
    })

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      play()

      hls.levels.sort((a, b) => b.height - a.height)

      setQualities(hls.levels)
      setAutoEnabled(hls.autoLevelEnabled)
      setLatency(hls.latency)
    })

    hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
      setCurrentQuality(hls.levels[data.level])
      seekLive()
    })

    hls.on(Hls.Events.ERROR, (_event, err) => {
      console.error(err)
    })

    hls.on(Hls.Events.LEVELS_UPDATED, (_event, data) => {
      console.log('levels updated', data)
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

    const latencyUpdater = setInterval(() => {
      setLatency(hls.latency)
    }, 1000)

    return () => {
      hls.destroy()
      clearInterval(latencyUpdater)
    }
  }, [streamUrl])

  const seekLive = () => {
    const livePosition = hlsRef.current.liveSyncPosition
    if (!livePosition || !videoRef.current) return

    videoRef.current.currentTime = livePosition
  }

  const setSelectedLevel = (level: number) => {
    const hls = hlsRef.current
    hls.currentLevel = level
    setAutoEnabled(hls.autoLevelEnabled)
  }

  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
      setCurrentSpeed(speed)
    }
  }

  const play = () => {
    videoRef.current?.play()
  }

  const pause = () => {
    videoRef.current?.pause()
  }

  const togglePictureInPicture = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture()
    } else {
      videoRef.current?.requestPictureInPicture()
    }
  }

  const toggleFullscreen = <E extends HTMLElement>(altRef?: RefObject<E>) => {
    const ref = altRef ?? videoRef
    if (ref.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        ref.current.requestFullscreen()
      }
    }
  }

  const mute = () => {
    if (videoRef.current) {
      videoRef.current.muted = true
      setMuted(true)
    }
  }

  const unmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false
      setMuted(false)
    }
  }

  const changeVolume = (volume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = volume
      setVolume(volume)

      if (volume === 0) {
        setMuted(true)
      }
    }
  }

  return {
    autoLevel: AUTO_LEVEL,
    autoEnabled,
    selectedLevel: autoEnabled ? AUTO_LEVEL : hlsRef.current.currentLevel,
    videoRef,
    qualities,
    currentQuality,
    setAutoEnabled,
    seekLive,
    setSelectedLevel,
    changePlaybackSpeed,
    currentSpeed,
    loading,
    play,
    pause,
    paused,
    togglePictureInPicture,
    toggleFullscreen,
    mute,
    unmute,
    volume,
    changeVolume,
    latency,
    playingDate: hlsRef.current.playingDate,
    muted,
  }
}
