import type {
  FindStreamerQuery,
  FindStreamerQueryVariables,
} from 'types/graphql'

import {
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
} from '@redwoodjs/web'

import Stream from '../Stream/Stream/Stream'

export const QUERY: TypedDocumentNode<
  FindStreamerQuery,
  FindStreamerQueryVariables
> = gql`
  query FindStreamerQuery($id: Int!) {
    streamer(id: $id) {
      id
      liveStreamId
      streamPath
      user {
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
  return (
    <div>
      Streamer {streamer.user.email}
      {streamer.liveStreamId && <Stream streamId={streamer.liveStreamId} />}
    </div>
  )
}
