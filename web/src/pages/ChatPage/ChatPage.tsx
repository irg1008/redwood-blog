import { useEffect, useRef } from 'react'

import Hls from 'hls.js'

import { Metadata } from '@redwoodjs/web'

import ChatBox from 'src/components/Chat/ChatBox/ChatBox'
import { ChatMessagesCellProps } from 'src/components/Chat/ChatMessagesCell'

const hls = new Hls({
  debug: false,
  enableWorker: true,
  lowLatencyMode: true,
})

const ChatPage = ({ streamId }: ChatMessagesCellProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    console.log('mounting')
    if (Hls.isSupported() && videoRef.current) {
      hls.attachMedia(videoRef.current)

      videoRef.current.setAttribute('webkit-playsinline', 'true')

      hls.loadSource(
        'https://localhost:8888/clxnnuw9b0001z9lw3rqr2a0g/index.m3u8?jwt=eyJhbGciOiJQUzI1NiIsImtpZCI6ImJhc2UifQ.eyJtZWRpYW10eF9wZXJtaXNzaW9ucyI6W3siYWN0aW9uIjoicmVhZCIsInBhdGgiOiJjbHhubnV3OWIwMDAxejlsdzNycXIyYTBnIn1dLCJleHAiOjE3MTkwMTAyNjQsImlhdCI6MTcxOTAwNjY2NH0.Ws8I3Czu4fTTRXcMEFFD4BGokIUEGo3xK5UhbA048qOPtBp0IAL6xCXIg9EbvTMXOTgYwGjHuw7sWRoGl-64q3oLYdlNSYJ-hQO65e1yxmLHzy9TLDy33oYOSIPveqEcnH-aEkY__R7SSwcMd9gTTrmegZDtoGEpJd3Eg6nw-gK-qVkkIrWrX4k-qy7FWxqddFM9UKuj6rXO1-HPsYeryWDHbLlWHolP7LES4Po1-qFGXKPqjyCKVtaaVBhO9YX_AJFjtlwYt85FeE-arWO-cnb-tHbQQg8mh5HgWz6fgHTBsVQU3HWB9y-gXkqZh47rLK72Pn-IRmJvVtUQf1cIlw'
      )
      // hls.loadSource('/api/live-url')

      hls.on(Hls.Events.ERROR, (err) => {
        console.log(err)
      })
    }
  }, [])

  return (
    <>
      <Metadata title="Chat" description="Chat page" />

      <video
        autoPlay
        muted
        playsInline
        ref={videoRef}
        controls
        className="w-full grow pe-80"
      >
        <track kind="captions" />
      </video>

      <aside className="absolute right-0 top-0 flex h-full w-80 pt-16">
        <ChatBox streamId={streamId} />
      </aside>
    </>
  )
}

export default ChatPage
