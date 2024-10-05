export const schema = gql`
  type Streamer {
    id: Int!
    liveStreamId: Int
    streamPath: String!
    user: User!
  }

  type Query {
    streamer(id: Int!): Streamer @skipAuth
  }
`
