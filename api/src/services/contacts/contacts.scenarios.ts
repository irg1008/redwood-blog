import type { Prisma, Contact } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ContactCreateArgs>({
  contact: {
    nameless: {
      data: {
        email: 'nameless@example.com',
        message: 'Hi!',
      },
    },
    john: {
      data: {
        name: 'John',
        email: 'john.doe@example.com',
        message: 'Hi!',
      },
    },
  },
})

export type StandardScenario = ScenarioData<
  Contact,
  'contact',
  'john' | 'nameless'
>
