import type { Comment, Prisma } from '@prisma/client'
import { Post } from 'types/graphql'

import type { ScenarioData } from '@redwoodjs/testing/api'

import { createUser } from '../posts/posts.scenarios'

const USER_JANE = createUser('Jane Doe', 'jane@doe.com')
const USER_JOHN = createUser('John Doe', 'john@doe.com')
const USER_GROGU = createUser('Grogu', 'grogu@jedi.com')

// @ts-expect-error - required for complex scenario
export const standard = defineScenario<Prisma.CommentCreateArgs>({
  comment: {
    john: {
      data: {
        name: 'John Doe',
        body: 'Comment body 1',
        post: {
          create: {
            title: 'My example post 1',
            slug: 'my-example-post-1',
            body: 'This is the body of my example post 1',
            user: { create: USER_JANE },
          },
        },
      },
    },
    jane: {
      data: {
        name: 'Jane Doe',
        body: 'Comment body 2',
        post: {
          create: {
            title: 'My example post 2',
            slug: 'my-example-post-2',
            body: 'This is the body of my example post 2',
            user: { create: USER_JOHN },
          },
        },
      },
    },
  },
})

export const postOnly = defineScenario<Prisma.PostCreateArgs>({
  post: {
    mandalorian: {
      data: {
        title: 'The Mandalorian',
        slug: 'the-mandalorian',
        body: 'The mandalorian is a great show',
        user: { create: USER_GROGU },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Comment, 'comment', 'john' | 'jane'>
export type PostOnlyScenario = ScenarioData<Post, 'post', 'mandalorian'>
