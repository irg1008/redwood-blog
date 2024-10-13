export const schema = gql`
  type Stream {
    id: Int!
    recordingId: String!
    streamer: Streamer!
    streamerLive: Streamer
    createdAt: DateTime!
    closedAt: DateTime
  }

  type StreamKey {
    streamKey: String!
  }

  type StreamUrl {
    streamUrl: String!
  }

  type Query {
    readStream(streamId: Int!): StreamUrl! @skipAuth
  }

  input CreateStreamKeyInput {
    userId: Int!
  }

  type Mutation {
    adminCreateStreamKey(input: CreateStreamKeyInput!): StreamKey
      @requireAuth(roles: ["admin"])
    createStreamKey: StreamKey @requireAuth
  }
`
