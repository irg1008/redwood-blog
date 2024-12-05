import type {
  MutationResolvers,
  QueryResolvers,
  QueryadminPostArgs,
} from 'types/graphql'

import { validate } from '@redwoodjs/api'
import { ForbiddenError } from '@redwoodjs/graphql-server'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

const veryfyOwnership = async ({ id }: QueryadminPostArgs) => {
  const post = await adminPost({ id })
  if (!post) throw new ForbiddenError("You don't have access to this post")
  return post
}

export const adminPosts: QueryResolvers['adminPosts'] = () => {
  const user = requireAuth({ roles: 'admin' })
  return db.post.findMany({ where: { userId: user.id } })
}

export const adminPost: QueryResolvers['adminPost'] = ({ id }) => {
  const user = requireAuth({ roles: 'admin' })
  return db.post.findUnique({
    where: { id, userId: user.id },
  })
}

export const createPost: MutationResolvers['createPost'] = async ({
  input,
}) => {
  const user = requireAuth({ roles: 'admin' })

  const existingPost = await db.post.findFirst({ where: { slug: input.slug } })
  validate(existingPost?.slug, 'slug', {
    absence: { message: 'Slug already exists' },
  })

  return db.post.create({
    data: { ...input, userId: user.id },
  })
}

export const updatePost: MutationResolvers['updatePost'] = async ({
  id,
  input,
}) => {
  await veryfyOwnership({ id })
  return db.post.update({
    data: {
      slug: input.slug ?? undefined,
      body: input.body ?? undefined,
      title: input.title ?? undefined,
    },
    where: { id },
  })
}

export const deletePost: MutationResolvers['deletePost'] = async ({ id }) => {
  await veryfyOwnership({ id })
  return db.post.delete({ where: { id } })
}
