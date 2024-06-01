import type { Prisma, User } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: {
        email: 'one@example.com',
        hashedPassword: 'onePass',
        salt: 'onePassSalt',
      },
    },
    two: {
      data: {
        email: 'two@example.com',
        hashedPassword: 'twoPass',
        salt: 'twoPassSalt',
      },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user', 'one' | 'two'>
