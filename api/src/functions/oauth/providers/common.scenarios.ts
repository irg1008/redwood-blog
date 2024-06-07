import type { Identity, Prisma, Provider, User } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

import { ProviderUser } from './common'

export const providerUser: ProviderUser = {
  id: 323423443,
  email: 'fromgithub@mail.com',
  name: 'From Github',
}

export const provider: Provider = 'github'

export const defaultScope = 'user:email'
export const defaultAccessToken = '123456'

export const standard = defineScenario<Prisma.IdentityCreateArgs>({
  identity: {
    github: {
      data: {
        provider,
        uid: providerUser.id.toString(),
        user: {
          create: {
            email: providerUser.email,
            name: providerUser.name,
            confirmed: true,
          },
        },
        scope: defaultScope,
        accessToken: defaultAccessToken,
      },
    },
  },
})

export const existingUser = defineScenario<Prisma.UserCreateArgs>({
  user: {
    unconfirmed: {
      data: {
        email: 'user@mail.com',
        name: 'User',
        hashedPassword: 'password',
        salt: 'salt',
        confirmed: false,
      },
    },
    alreadyConfirmed: {
      data: {
        email: 'user2@mail.com',
        name: 'User',
        hashedPassword: 'password',
        salt: 'salt',
        confirmed: true,
      },
    },
  },
})

export type FoundIdentityScenario = ScenarioData<Identity, 'identity', 'github'>
export type ExistingUserScenario = ScenarioData<
  User,
  'user',
  'unconfirmed' | 'alreadyConfirmed'
>
