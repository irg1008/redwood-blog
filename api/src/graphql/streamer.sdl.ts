export const schema = gql`
  type Streamer {
    id: Int!
    liveStreamId: Int
    liveStream: Stream
    streamPath: String!
    userId: Int!
    user: User!
  }

  type Query {
    streamer(id: Int!): Streamer @skipAuth
  }
`
