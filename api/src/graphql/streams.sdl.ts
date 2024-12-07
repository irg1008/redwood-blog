export const schema = gql`
  type Stream {
    id: Int!
    recordingId: String!
    streamer: Streamer!
    streamerLive: Streamer
    createdAt: DateTime!
    closedAt: DateTime
  }

  type StreamUrl {
    streamUrl: String!
    thumbnailUrl: String!
  }

  type Query {
    getStreamUrl(streamId: Int!): StreamUrl! @skipAuth
  }
`
