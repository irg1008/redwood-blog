export const schema = gql`
  input ServerEventInput {
    userId: Int
    message: String!
    topic: String!
  }

  type ServerEvent {
    message: String!
    topic: String!
  }

  extend type Mutation {
    sendServerEvent(input: ServerEventInput!): ServerEvent!
      @requireAuth(roles: ["worker"])
  }
`
