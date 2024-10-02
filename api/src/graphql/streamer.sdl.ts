export const schema = gql`
  type Streamer {
    id: Int!
    liveStreamId: Int
    user: User!
  }

  type Query {
    streamer(id: Int!): Streamer @skipAuth
  }
`
