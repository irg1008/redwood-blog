export const schema = gql`
  type ChatUser {
    id: Int!
    email: String!
  }

  type ChatMessage {
    id: String!
    streamId: Int!
    user: ChatUser!
    userId: Int!
    body: String!
    createdAt: DateTime!
  }

  type Query {
    chatMessages(streamId: Int!): [ChatMessage!]! @skipAuth
  }

  input ChatMessageInput {
    body: String!
    streamId: Int!
  }

  type Mutation {
    sendChatMessage(input: ChatMessageInput!): ChatMessage! @requireAuth
  }
`
