import type { ReadStreamQuery, ReadStreamQueryVariables } from 'types/graphql'

import {
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
} from '@redwoodjs/web'

import StreamVideo from '../StreamVideo/StreamVideo'

export const QUERY: TypedDocumentNode<
  ReadStreamQuery,
  ReadStreamQueryVariables
> = gql`
  query ReadStreamQuery($streamId: Int!) {
    stream: readStream(streamId: $streamId) {
      streamUrl
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<ReadStreamQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  stream,
}: CellSuccessProps<ReadStreamQuery, ReadStreamQueryVariables>) => {
  return <StreamVideo streamUrl={'/api/live/1'} />
  // return <StreamVideo streamUrl={stream.streamUrl} />
}
