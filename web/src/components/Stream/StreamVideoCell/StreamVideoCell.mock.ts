import { GetStreamUrlQuery } from 'types/graphql'

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  stream: {
    streamUrl: 'https://example.com/stream',
    thumbnailUrl: 'https://example.com/thumbnail',
  } satisfies GetStreamUrlQuery['stream'],
})
