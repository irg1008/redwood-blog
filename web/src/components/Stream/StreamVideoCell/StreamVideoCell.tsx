import type {
  GetStreamUrlQuery,
  GetStreamUrlQueryVariables,
} from 'types/graphql'

import {
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
} from '@redwoodjs/web'

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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<GetStreamUrlQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

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
