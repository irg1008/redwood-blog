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
    liveStream: {
      id: 1,
      createdAt: new Date().toISOString(),
      closedAt: new Date().toISOString(),
      recordingId: '1',
    },
  } satisfies FindStreamerQuery['streamer'],
})
