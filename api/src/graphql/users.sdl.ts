export const schema = gql`
  type User {
    id: Int!
    name: String
    email: String!
    roles: Role!
    posts: [Post]!
  }

  enum Role {
    moderator
    admin
    user
  }

  type Query {
    users: [User!]! @requireAuth(roles: "admin")
    user(id: Int!): User @requireAuth
  }

  input ConfirmUserInput {
    email: String!
    code: Int!
  }

  type Mutation {
    confirmUser(input: ConfirmUserInput!): User @skipAuth
    sendConfirmCode(email: String!): Boolean @skipAuth
  }
`
