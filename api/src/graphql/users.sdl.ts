export const schema = gql`
  type User {
    id: Int!
    name: String
    email: String!
    # hashedPassword: String!
    # salt: String!
    # resetToken: String
    # resetTokenExpiresAt: DateTime
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
`
