import { GetStreamUrlQuery } from 'types/graphql'

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  stream: {
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnailUrl: 'https://example.com/thumbnail',
  } satisfies GetStreamUrlQuery['stream'],
})
