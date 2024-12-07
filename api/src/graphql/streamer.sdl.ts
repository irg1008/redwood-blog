export const schema = gql`
  type Streamer {
    id: Int!
    liveStreamId: Int
    liveStream: Stream
    streamPath: String!
    userId: Int!
    user: User!
  }

  type StreamKey {
    streamKey: String!
  }

  input CreateStreamKeyInput {
    userId: Int!
  }

  type Query {
    streamer(id: Int!): Streamer @skipAuth
  }

  type Mutation {
    adminCreateStreamKey(input: CreateStreamKeyInput!): StreamKey
      @requireAuth(roles: ["admin"])
    createStreamKey: StreamKey @requireAuth
  }
`
