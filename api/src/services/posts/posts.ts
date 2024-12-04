import type { PostRelationResolvers, QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const posts: QueryResolvers['posts'] = () => {
  return db.post.findMany()
}

export const post: QueryResolvers['post'] = ({ slug }) => {
  return db.post.findUnique({ where: { slug } })
}

export const Post: PostRelationResolvers = {
  user: (_obj, { root }) => {
    return db.post.findUniqueOrThrow({ where: { id: root.id } }).user()
  },
}
