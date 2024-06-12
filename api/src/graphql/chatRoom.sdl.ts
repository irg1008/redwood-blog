export const schema = gql`
  type ChatUser {
    id: Int!
    displayName: String!
  }

  type ChatMessage {
    id: Int!
    chatRoomId: String!
    user: ChatUser!
    body: String!
    createdAt: DateTime!
    # We could have properties for message for different user roles on the room, like isHidden
  }

  type Query {
    chatMessages(chatRoomId: String!): [ChatMessage!]! @skipAuth
  }

  input ChatMessageInput {
    body: String!
    chatRoomId: String!
  }

  type Mutation {
    sendChatMessage(input: ChatMessageInput!): ChatMessage! @requireAuth
  }
`
