import { validate } from '@redwoodjs/api'

export enum StreamConnector {
  JPG = 'JPG',
  HLS = 'CMAF',
}

export function validateStreamConnector(
  connector: string
): asserts connector is StreamConnector {
  const validConnectors = Object.values(StreamConnector)
  validate(connector, {
    inclusion: {
      in: validConnectors,
      message: `Invalid connector. Must be one of ${validConnectors.join(', ')}`,
    },
  })
}
