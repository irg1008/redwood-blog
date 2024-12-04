import { ok } from 'node:assert'

import { CreatePostInput } from 'types/graphql'

import { AbsenceValidationError } from '@redwoodjs/api'
import { AuthenticationError, ForbiddenError } from '@redwoodjs/graphql-server'

import { user } from 'src/services/users'

import {
  adminPost,
  adminPosts,
  createPost,
  deletePost,
  updatePost,
} from './adminPosts'
import type { StandardScenario } from './adminPosts.scenarios'

const POST: CreatePostInput = {
  title: 'Example',
  slug: 'example',
  body: 'Example Body',
}

const mockUser = () => {
  mockCurrentUser({ id: -1, email: 'user@user', roles: 'user' })
}

const mockAdmin = () => {
  mockCurrentUser({ id: -1, email: 'admin@admin', roles: 'admin' })
}

describe('adminPosts', () => {
  scenario('returns all admin posts', async (scenario: StandardScenario) => {
    const postUser = await user({ id: scenario.post.oneJohn.userId })
    ok(postUser)

    mockCurrentUser(postUser)

    const result = await adminPosts()

    const johnPosts = [scenario.post.oneJohn, scenario.post.twoJohn]

    expect(result).toHaveLength(johnPosts.length)
    johnPosts.forEach((post) => expect(result).toContainEqual(post))
  })

  scenario('logged out users cannot view admin posts', async () => {
    const adminPostsFunc = () => adminPosts()
    expect(adminPostsFunc).toThrow(AuthenticationError)
  })

  scenario('non admin users cannot view admin posts', async () => {
    mockUser()

    const adminPostsFunc = () => adminPosts()
    expect(adminPostsFunc).toThrow(ForbiddenError)
  })

  scenario('admin users can view only their posts', async () => {
    mockAdmin()

    const result = await adminPosts()
    expect(result).toEqual([])
  })

  scenario(
    'returns a single admin post',
    async (scenario: StandardScenario) => {
      const post = scenario.post.threeJane

      const postUser = await user({ id: post.userId })
      ok(postUser)

      mockCurrentUser(postUser)

      const result = await adminPost({ id: post.id })
      expect(result).toEqual(scenario.post.threeJane)
    }
  )

  scenario(
    'logged out users cannot view an admin post',
    async (scenario: StandardScenario) => {
      const adminPostFunc = () => adminPost({ id: scenario.post.oneJohn.id })
      expect(adminPostFunc).toThrow(AuthenticationError)
    }
  )

  scenario('non admin users cannot view an admin post', async (scenario) => {
    mockUser()

    const adminPostFunc = () => adminPost({ id: scenario.post.oneJohn.id })
    expect(adminPostFunc).toThrow(ForbiddenError)
  })

  scenario(
    'admin users can view only their individual posts',
    async (scenario) => {
      mockAdmin()

      const result = await adminPost({ id: scenario.post.oneJohn.id })
      expect(result).toEqual(null)
    }
  )

  scenario(
    'admin user can create a post',
    async (scenario: StandardScenario) => {
      const post = scenario.post.oneJohn
      const postUser = await user({ id: post.userId })
      ok(postUser)

      mockCurrentUser(postUser)

      const result = await createPost({ input: POST })

      expect(result.title).toEqual(POST.title)
      expect(result.slug).toEqual(POST.slug)
      expect(result.body).toEqual(POST.body)
      expect(result.createdAt).not.toEqual(null)
      expect(result.userId).toEqual(postUser.id)
    }
  )

  scenario('logged out users cannot create a post', async () => {
    const createFunc = () => createPost({ input: POST })
    await expect(createFunc).rejects.toThrow(AuthenticationError)
  })

  scenario('non admin users cannot create a post', async () => {
    mockUser()

    const createFunc = () => createPost({ input: POST })
    await expect(createFunc).rejects.toThrow(ForbiddenError)
  })

  scenario(
    'cannot create a post with a duplicate slug',
    async (scenario: StandardScenario) => {
      const post = scenario.post.oneJohn

      const postUser = await user({ id: post.userId })
      ok(postUser)

      mockCurrentUser(postUser)

      const createFunc = () =>
        createPost({ input: { ...POST, slug: post.slug } })

      await expect(createFunc).rejects.toThrow(AbsenceValidationError)
      await expect(createFunc).rejects.toThrow('Slug already exists')
    }
  )

  scenario(
    'admin users can update a post',
    async (scenario: StandardScenario) => {
      const post = scenario.post.twoJohn

      const postUser = await user({ id: post.userId })
      ok(postUser)

      mockCurrentUser(postUser)

      const newTitle = 'Example2'
      const result = await updatePost({
        id: post.id,
        input: { title: newTitle },
      })

      expect(result.title).toEqual(newTitle)
      expect(result.userId).toEqual(postUser.id)
    }
  )

  scenario('logged out users cannot update a post', async () => {
    const updateFunc = () => updatePost({ id: 0, input: {} })
    await expect(updateFunc).rejects.toThrow(AuthenticationError)
  })

  scenario(
    'non admin users cannot update a post',
    async (scenario: StandardScenario) => {
      mockUser()

      const post = scenario.post.oneJohn
      const updateFunc = () => updatePost({ id: post.id, input: {} })

      await expect(updateFunc).rejects.toThrow(ForbiddenError)

      const postUser = await user({ id: post.userId })
      ok(postUser)

      mockCurrentUser(postUser)

      const original = await adminPost({ id: post.id })
      expect(original).toEqual(post)
    }
  )

  scenario(
    'admin users can update only their posts',
    async (scenario: StandardScenario) => {
      mockAdmin()

      const post = scenario.post.oneJohn

      const updateFunc = () => updatePost({ id: post.id, input: {} })

      await expect(updateFunc).rejects.toThrow(ForbiddenError)
      await expect(updateFunc).rejects.toThrow(
        "You don't have access to this post"
      )

      const postUser = await user({ id: post.userId })
      ok(postUser)

      mockCurrentUser(postUser)

      const original = await adminPost({ id: post.id })
      expect(original).toEqual(post)
    }
  )

  scenario(
    'admin users can delete a post',
    async (scenario: StandardScenario) => {
      const post = scenario.post.oneJohn
      const postUser = await user({ id: post.userId })
      ok(postUser)

      mockCurrentUser(postUser)

      const original = await deletePost({ id: post.id })
      const result = await adminPost({ id: original.id })

      expect(result).toEqual(null)
    }
  )

  scenario(
    'logged out users cannot delete a post',
    async (scenario: StandardScenario) => {
      const post = scenario.post.oneJohn

      const deleteFunc = () => deletePost({ id: post.id })
      await expect(deleteFunc).rejects.toThrow(AuthenticationError)

      const postUser = await user({ id: post.userId })
      ok(postUser)

      mockCurrentUser(postUser)

      const original = await adminPost({ id: post.id })
      expect(original).toEqual(post)
    }
  )

  scenario(
    'non admin users cannot delete a post',
    async (scenario: StandardScenario) => {
      mockUser()

      const post = scenario.post.oneJohn

      const deleteFunc = () => deletePost({ id: post.id })
      await expect(deleteFunc).rejects.toThrow(ForbiddenError)

      const postUser = await user({ id: post.userId })
      ok(postUser)

      mockCurrentUser(postUser)

      const original = await adminPost({ id: post.id })
      expect(original).toEqual(post)
    }
  )

  scenario(
    'admin users can delete only their posts',
    async (scenario: StandardScenario) => {
      mockAdmin()

      const post = scenario.post.oneJohn

      const deleteFunc = () => deletePost({ id: post.id })

      await expect(deleteFunc).rejects.toThrow(ForbiddenError)
      await expect(deleteFunc).rejects.toThrow(
        "You don't have access to this post"
      )

      const postUser = await user({ id: post.userId })
      ok(postUser)

      mockCurrentUser(postUser)

      const original = await adminPost({ id: post.id })
      expect(original).toEqual(post)
    }
  )
})
