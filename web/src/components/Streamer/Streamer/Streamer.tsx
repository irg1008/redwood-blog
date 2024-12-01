import { useTranslation } from 'react-i18next'
import { FindStreamerQuery } from 'types/graphql'

import { CellSuccessProps } from '@redwoodjs/web'

import Stream from 'src/components/Stream/Stream/Stream'
import { useLiveTime } from 'src/hooks/useLiveTime'

type StreamerProps = CellSuccessProps<FindStreamerQuery>

const StreamerComponent = ({ streamer }: StreamerProps) => {
  const { t } = useTranslation()

  const {
    liveStream,
    user: { email },
  } = streamer

  return (
    <div className="flex flex-col gap-4">
      {email}{' '}
      {liveStream ? (
        <>
          <Stream stream={liveStream} />
          <LiveTime startDate={new Date(liveStream.createdAt)} />
        </>
      ) : (
        <>{t('streamer.not-live')}</>
      )}
    </div>
  )
}

type LiveTimeProps = {
  startDate: Date
}

const LiveTime = ({ startDate }: LiveTimeProps) => {
  const { t } = useTranslation()
  const { formattedTime } = useLiveTime(startDate)
  return <div>{t('streamer.live-for', { duration: formattedTime })}</div>
}

export default StreamerComponent
