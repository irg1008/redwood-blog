import type {
  QueryResolvers,
  MutationResolvers,
  QueryadminPostArgs,
} from 'types/graphql'

import { validate } from '@redwoodjs/api'
import { ForbiddenError } from '@redwoodjs/graphql-server'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

const veryfyOwnership = async ({ id }: QueryadminPostArgs) => {
  const post = await adminPost({ id })
  if (!post) throw new ForbiddenError("You don't have access to this post")
}

export const adminPosts: QueryResolvers['adminPosts'] = () => {
  requireAuth({ roles: 'admin' })

  const userId = context.currentUser.id
  return db.post.findMany({ where: { userId } })
}

export const adminPost: QueryResolvers['adminPost'] = ({ id }) => {
  requireAuth({ roles: 'admin' })

  const userId = context.currentUser.id
  return db.post.findUnique({
    where: { id, userId },
  })
}

export const createPost: MutationResolvers['createPost'] = async ({
  input,
}) => {
  requireAuth({ roles: 'admin' })

  const existingPost = await db.post.findFirst({ where: { slug: input.slug } })

  validate(existingPost?.slug, 'slug', {
    absence: { message: 'Slug already exists' },
  })

  const userId = context.currentUser.id
  return db.post.create({
    data: { ...input, userId },
  })
}

export const updatePost: MutationResolvers['updatePost'] = async ({
  id,
  input,
}) => {
  await veryfyOwnership({ id })

  const userId = context.currentUser.id
  return db.post.update({
    data: input,
    where: { id, userId },
  })
}

export const deletePost: MutationResolvers['deletePost'] = async ({ id }) => {
  await veryfyOwnership({ id })

  const userId = context.currentUser.id
  return db.post.delete({
    where: { id, userId },
  })
}
