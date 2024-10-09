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

export function validateStreamType(
  streamType: string
): asserts streamType is StreamType {
  validate(streamType, {
    inclusion: {
      in: Object.values(StreamType),
      message: 'Invalid stream type',
    },
  })
}

type StreamNameParts = {
  type: StreamType
  streamPath: string
  recordingId: string
}

export const parseStreamName = (streamName: StreamName): StreamNameParts => {
  const [type, wildcard] = streamName.split('+')
  const [streamPath, recordingId] = wildcard.split('_')

  validateStreamType(type)

  return {
    type,
    streamPath,
    recordingId,
  }
}

export const createStreamName = ({
  streamPath,
  type,
  recordingId,
}: StreamNameParts): StreamName => {
  return `${type}+${streamPath}_${recordingId}`
}
