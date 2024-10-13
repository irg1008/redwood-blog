import type {
  FindStreamerQuery,
  FindStreamerQueryVariables,
} from 'types/graphql'

import {
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
} from '@redwoodjs/web'

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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindStreamerQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  streamer,
}: CellSuccessProps<FindStreamerQuery, FindStreamerQueryVariables>) => {
  return <Streamer streamer={streamer} />
}
