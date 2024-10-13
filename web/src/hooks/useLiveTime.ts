import { useCallback, useEffect, useState } from 'react'

const formatLivetime = (liveTime: number) => {
  const remainingSeconds = liveTime % 60

  const minutes = Math.floor(liveTime / 60)
  const remainingMinutes = minutes % 60

  const hours = Math.floor(minutes / 60)
  const remainingHours = hours % 24

  const days = Math.floor(hours / 24)

  const padTime = (time: number, pad = 2) => time.toString().padStart(pad, '0')

  const formattedTime = [
    days > 0 ? padTime(days, 1) : null,
    padTime(remainingHours, days > 0 ? 2 : 1),
    padTime(remainingMinutes),
    padTime(remainingSeconds),
  ]
    .filter((time) => time !== null)
    .join(':')

  return {
    formattedTime,
    days,
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds,
  }
}

export const useLiveTime = (startDate: Date) => {
  const [liveTime, setLiveTime] = useState<number>(0) // In seconds

  const calculateLiveTime = useCallback(() => {
    const now = new Date()
    const diffInSeconds = Math.floor(
      (now.getTime() - startDate.getTime()) / 1000
    )
    setLiveTime(diffInSeconds)
  }, [startDate])

  useEffect(() => {
    calculateLiveTime()

    const interval = setInterval(() => {
      calculateLiveTime()
    }, 1000)

    return () => clearInterval(interval)
  }, [calculateLiveTime])

  return formatLivetime(liveTime)
}
