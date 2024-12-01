import { useTranslation } from 'react-i18next'
import type {
  FindStreamerQuery,
  FindStreamerQueryVariables,
} from 'types/graphql'

import {
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
} from '@redwoodjs/web'

import Spinner from 'src/components/UI/Spinner/Spinner'

import Streamer from '../Streamer/Streamer'

export const QUERY: TypedDocumentNode<
  FindStreamerQuery,
  FindStreamerQueryVariables
> = gql`
  query FindStreamerQuery($id: Int!) {
    streamer(id: $id) {
      id
      liveStreamId
      liveStream {
        id
        createdAt
        closedAt
        recordingId
      }
      streamPath
      userId
      user {
        id
        email
      }
    }
  }
`

export const Loading = Spinner

export const Empty = () => {
  const { t } = useTranslation()
  return <div>{t('streamer.empty')}</div>
}

export const Failure = ({
  error,
}: CellFailureProps<FindStreamerQueryVariables>) => {
  const { t } = useTranslation()
  return (
    <div style={{ color: 'red' }}>
      {t('streamer.error')}{' '}
      {error && t('common.error', { error: error?.message })}
    </div>
  )
}

export const Success = ({
  streamer,
}: CellSuccessProps<FindStreamerQuery, FindStreamerQueryVariables>) => {
  return <Streamer streamer={streamer} />
}
