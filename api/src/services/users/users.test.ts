import { db } from 'src/lib/db'

import { user, users } from './users'
import type { StandardScenario } from './users.scenarios'

describe('users', () => {
  beforeAll(async () => {
    await db.user.deleteMany()
  })

  scenario('returns all users', async (scenario: StandardScenario) => {
    const result = await users()
    expect(result.length).toEqual(Object.keys(scenario.user).length)
  })

  scenario('returns a single user', async (scenario: StandardScenario) => {
    const result = await user({ id: scenario.user.one.id })
    expect(result).toEqual(scenario.user.one)
  })
})
