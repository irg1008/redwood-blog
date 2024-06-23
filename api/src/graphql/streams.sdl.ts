export const schema = gql`
  type Streamer {
    id: Int!
    streamPath: String!
    live: Boolean!
  }

  type StreamToken {
    streamToken: String!
  }

  type Query {
    streamer(id: Int!): Streamer @skipAuth
    readStream(streamPath: String!): [String!]! @skipAuth
  }

  input CreateStreamTokenInput {
    userId: Int!
  }

  type Mutation {
    adminCreateStreamToken(input: CreateStreamTokenInput!): StreamToken
      @requireAuth(roles: ["admin"])
    createStreamToken: StreamToken @requireAuth
  }
`
