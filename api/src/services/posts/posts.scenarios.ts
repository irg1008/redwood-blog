import type { Prisma, Post } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.PostCreateArgs>({
  post: {
    one: { data: { title: 'String', slug: 'String9624478', body: 'String' } },
    two: { data: { title: 'String', slug: 'String4507812', body: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Post, 'post'>
