import { useTranslation } from 'react-i18next'
import type {
  GetStreamUrlQuery,
  GetStreamUrlQueryVariables,
} from 'types/graphql'

import {
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
} from '@redwoodjs/web'

import Spinner from 'src/components/UI/Spinner/Spinner'

import StreamVideo from '../StreamVideo/StreamVideo'

export const QUERY: TypedDocumentNode<
  GetStreamUrlQuery,
  GetStreamUrlQueryVariables
> = gql`
  query GetStreamUrlQuery($streamId: Int!) {
    stream: getStreamUrl(streamId: $streamId) {
      streamUrl
      thumbnailUrl
    }
  }
`

export const Loading = () => <Spinner />

export const Empty = () => {
  const { t } = useTranslation()
  return <div>{t('stream-player.empty')}</div>
}

export const Failure = ({
  error,
}: CellFailureProps<GetStreamUrlQueryVariables>) => {
  const { t } = useTranslation()
  return (
    <div style={{ color: 'red' }}>
      {t('stream-player.error')}{' '}
      {error && t('common.error', { error: error.message })}
    </div>
  )
}

export const Success = ({
  stream,
}: CellSuccessProps<GetStreamUrlQuery, GetStreamUrlQueryVariables>) => {
  return (
    <StreamVideo
      streamUrl={stream.streamUrl}
      thumbnailUrl={stream.thumbnailUrl}
    />
  )
}
