export const schema = gql`
  input SendServerEventInput {
    userId: Int!
    message: String!
    topic: String!
  }

  type ServerEventResult {
    message: String!
    topic: String!
  }

  extend type Mutation {
    sendServerEvent(input: SendServerEventInput!): ServerEventResult!
      @requireWorker
  }
`
