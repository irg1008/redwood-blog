import { Redis } from 'ioredis'

import { RedwoodRealtimeOptions } from '@redwoodjs/realtime'

import subscriptions from 'src/subscriptions/**/*.{js,ts}'

import { redisOptions } from './kv'

const publishClient = new Redis(redisOptions)
const subscribeClient = new Redis(redisOptions)

/**
 * Configure RedwoodJS Realtime
 *
 * See https://redwoodjs.com/docs/realtime
 *
 * Realtime supports Live Queries and Subscriptions over GraphQL SSE.
 *
 * Live Queries are GraphQL queries that are automatically re-run when the data they depend on changes.
 *
 * Subscriptions are GraphQL queries that are run when a client subscribes to a channel.
 *
 * Redwood Realtime
 *  - uses a publish/subscribe model to broadcast data to clients.
 *  - uses a store to persist Live Query and Subscription data.
 *  - and enable defer and stream directives to improve latency
 *    for clients by sending data the most important data as soon as it's ready.
 *
 * Redwood Realtime supports in-memory and Redis stores:
 * - In-memory stores are useful for development and testing.
 * - Redis stores are useful for production.
 *
 */
export const realtime: RedwoodRealtimeOptions = {
  subscriptions: {
    subscriptions,
    // store: 'in-memory',
    store: { redis: { publishClient, subscribeClient } },
  },
  liveQueries: {
    // store: 'in-memory',
    store: { redis: { publishClient, subscribeClient } },
  },
  // To enable defer and streaming, set to true.
  // enableDeferStream: true,
}
