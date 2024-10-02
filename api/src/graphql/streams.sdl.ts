export const schema = gql`
  type StreamToken {
    streamToken: String!
  }

  type StreamUrl {
    streamUrl: String!
  }

  type Query {
    readStream(streamId: Int!): StreamUrl! @skipAuth
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
