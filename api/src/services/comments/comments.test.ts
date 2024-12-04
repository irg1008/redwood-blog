import assert from 'node:assert'

import { CreateCommentInput } from 'types/graphql'

import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { comments, createComment, deleteComment } from './comments'
import type { PostOnlyScenario, StandardScenario } from './comments.scenarios'

describe('comments', () => {
  scenario(
    'returns all comments for a single post from the database',
    async (scenario: StandardScenario) => {
      const { postId } = scenario.comment.john
      const result = await comments({ postId })

      const post = await db.post.findUnique({
        where: { id: postId },
        include: { comments: true },
      })
      assert(post)

      expect(result.length).toEqual(post.comments.length)
    }
  )

  scenario(
    'postOnly',
    'creates a new comment',
    async (scenario: PostOnlyScenario) => {
      const comment: CreateCommentInput = {
        name: 'Pedro Pascal',
        body: 'This is the way',
        postId: scenario.post.mandalorian.id,
      }

      const result = await createComment({ input: comment })

      expect(result.name).toEqual(comment.name)
      expect(result.body).toEqual(comment.body)
      expect(result.postId).toEqual(comment.postId)
      expect(result.createdAt).not.toEqual(null)

      const commentsResult = await comments({
        postId: scenario.post.mandalorian.id,
      })

      expect(commentsResult.length).toEqual(1)
    }
  )

  scenario(
    'allows a moderator to delete a comment',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: 1,
        email: 'moderator@gmail.com',
        roles: 'moderator',
      })

      const comment = await deleteComment({
        id: scenario.comment.jane.id,
      })
      expect(comment.id).toEqual(scenario.comment.jane.id)

      const result = await comments({ postId: scenario.comment.jane.postId })
      expect(result.length).toEqual(0)
    }
  )

  scenario(
    'allows an admin to delete a comment',
    async (scenario: StandardScenario) => {
      mockCurrentUser({
        id: 1,
        email: 'admin@gmail.com',
        roles: 'admin',
      })

      const comment = await deleteComment({
        id: scenario.comment.jane.id,
      })
      expect(comment.id).toEqual(scenario.comment.jane.id)

      const result = await comments({ postId: scenario.comment.jane.postId })
      expect(result.length).toEqual(0)
    }
  )

  scenario(
    'does not allow a non-moderator to delete a comment',
    async (scenario: StandardScenario) => {
      mockCurrentUser({ id: -1, email: 'user@user.com', roles: 'user' })

      expect(() =>
        deleteComment({
          id: scenario.comment.jane.id,
        })
      ).toThrow(ForbiddenError)
    }
  )

  scenario(
    'does not allow a logged out user to delete a comment',
    async (scenario: StandardScenario) => {
      expect(() =>
        deleteComment({
          id: scenario.comment.jane.id,
        })
      ).toThrow(AuthenticationError)
    }
  )
})
