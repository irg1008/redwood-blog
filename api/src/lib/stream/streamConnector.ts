import { validate } from '@redwoodjs/api'

export enum StreamConnector {
  JPG = 'JPG',
  CMAF = 'CMAF',
  HTTP = 'HTTP',
  MP4 = 'MP4',
  HLS = 'HLS',
}

export function validateStreamConnector(
  connector: string
): asserts connector is StreamConnector {
  const validConnectors = Object.values(StreamConnector)
  validate(connector, {
    inclusion: {
      in: validConnectors,
      message: `Invalid connector ${connector || '[EMPTY]'}. Must be one of ${validConnectors.join(', ')}`,
    },
  })
}
