import { QueryResolvers, StreamerRelationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const streamer: QueryResolvers['streamer'] = ({ id }) => {
  return db.streamer.findUnique({
    where: { id },
  })
}

export const Streamer: StreamerRelationResolvers = {
  user: (_obj, { root }) => {
    return db.streamer.findUnique({ where: { id: root?.id } }).user()
  },
  liveStream: (_obj, { root }) => {
    return db.streamer.findUnique({ where: { id: root?.id } }).liveStream()
  },
}
