export const schema = gql`
  type Post {
    id: Int!
    title: String!
    slug: String!
    body: String!
    createdAt: DateTime!
  }

  type Query {
    posts: [Post!]! @skipAuth
    post(slug: String!): Post @skipAuth
  }

  input CreatePostInput {
    title: String!
    slug: String!
    body: String!
  }

  input UpdatePostInput {
    title: String
    slug: String
    body: String
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post! @requireAuth
    updatePost(id: Int!, input: UpdatePostInput!): Post! @requireAuth
    deletePost(id: Int!): Post! @requireAuth
  }
`
