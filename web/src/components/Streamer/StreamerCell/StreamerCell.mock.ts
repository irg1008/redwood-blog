import { FindStreamerQuery } from 'types/graphql'

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  streamer: {
    id: 42,
    userId: 1,
    streamPath: '',
    user: {
      id: 1,
      email: 'email@email.com',
    },
  } satisfies FindStreamerQuery['streamer'],
})
