import { useTranslation } from 'react-i18next'

import { Metadata } from '@redwoodjs/web'

import StreamerCell from 'src/components/Streamer/StreamerCell'

const StreamerPage = ({ streamerId }: { streamerId: number }) => {
  const { t } = useTranslation()
  return (
    <>
      <Metadata
        title={t('Streamer.title')}
        description={t('Streamer.description')}
      />
      <StreamerCell id={streamerId} />
    </>
  )
}

export default StreamerPage
