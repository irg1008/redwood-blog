import type { Post, Prisma } from '@prisma/client'

import { hashPassword } from '@redwoodjs/auth-dbauth-api'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const createAdminUser = (
  name: string,
  email: string
): Prisma.UserCreateInput => {
  const [hashedPassword, salt] = hashPassword('password123')
  return { name, email, hashedPassword, salt, roles: 'admin' }
}

const USER_JOHN = createAdminUser('John Doe', 'john@doe.com')
const USER_JANE = createAdminUser('Jane Doe', 'jane@doe.com')

// @ts-expect-error - required for complex scenario
export const standard = defineScenario<Prisma.PostCreateArgs>({
  post: {
    oneJohn: {
      data: {
        title: 'Title1',
        slug: 'title1',
        body: 'Body1',
        user: { create: USER_JOHN },
      },
    },
    twoJohn: {
      data: {
        title: 'Title2',
        slug: 'title2',
        body: 'Body2',
        user: { connect: { email: USER_JOHN.email } },
      },
    },
    threeJane: {
      data: {
        title: 'Title3',
        slug: 'title3',
        body: 'Body3',
        user: { create: USER_JANE },
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  Post,
  'post',
  'oneJohn' | 'twoJohn' | 'threeJane'
>
