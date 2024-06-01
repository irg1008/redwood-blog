export const schema = gql`
  type Post {
    id: Int!
    title: String!
    slug: String!
    body: String!
    createdAt: DateTime!
    userId: Int!
    user: User!
  }

  type Query {
    posts: [Post!]! @skipAuth
    post(slug: String!): Post @skipAuth
  }
`
