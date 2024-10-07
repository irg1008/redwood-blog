import { validate } from '@redwoodjs/api'

export enum StreamType {
  Live = 'live',
  Recording = 'recording',
  Segment = 'segment',
}

export type StreamName = `${StreamType}+${string}_${string}`

export function validateStreamName(
  streamName: string
): asserts streamName is StreamName {
  validate(streamName, {
    format: {
      pattern: /^(live|recording|segment)\+[a-zA-Z0-9]+_[a-zA-Z0-9]+$/,
      message: 'Invalid stream name',
    },
  })
}

export const parseStreamName = (streamName: StreamName) => {
  const [type, wildcard] = streamName.split('+')
  const [streamPath, uniqueId] = wildcard.split('_')
  return {
    type,
    streamPath,
    uniqueId,
  }
}

export const createStreamName = (
  streamType: StreamType,
  streamPath: string,
  uniqueId: string
): StreamName => {
  return `${streamType}+${streamPath}_${uniqueId}`
}
