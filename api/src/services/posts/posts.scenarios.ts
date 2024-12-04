import type { Post, Prisma } from '@prisma/client'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const createUser = (
  name: string,
  email: string
): Prisma.UserCreateInput => {
  const [hashedPassword, salt] = hashPassword('password123')
  return { name, email, hashedPassword, salt }
}

export const POST_USER = createUser('John Doe', 'john@doe.com')
export const standard = defineScenario<Prisma.PostCreateArgs>({
  post: {
    one: {
      data: {
        title: 'Title1',
        slug: 'title1',
        body: 'Body1',
        user: { create: POST_USER },
      },
    },
    two: {
      data: {
        title: 'Title2',
        slug: 'title2',
        body: 'Body2',
        user: { connect: { email: POST_USER.email } },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Post, 'post', 'one' | 'two'>
