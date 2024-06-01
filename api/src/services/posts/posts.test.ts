import { posts, post } from './posts'
import type { StandardScenario } from './posts.scenarios'

describe('posts', () => {
  scenario('returns all posts', async (scenario: StandardScenario) => {
    const result = await posts()

    expect(result.length).toEqual(Object.keys(scenario.post).length)
  })

  scenario('returns a single post', async (scenario: StandardScenario) => {
    const result = await post({ slug: scenario.post.one.slug })
    expect(result).toEqual(scenario.post.one)
  })
})
