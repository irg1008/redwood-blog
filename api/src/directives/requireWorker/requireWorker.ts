import type { APIGatewayProxyEvent } from 'aws-lambda'
import gql from 'graphql-tag'

import type { ValidatorDirectiveFunc } from '@redwoodjs/graphql-server'
import { createValidatorDirective } from '@redwoodjs/graphql-server'

import { requireWorker as applicationRequireWorker } from 'src/lib/auth'

export const schema = gql`
  """
  Use to check whether the request is signed by the background jobs worker
  """
  directive @requireWorker on FIELD_DEFINITION
`

const validate: ValidatorDirectiveFunc = ({ context }) => {
  applicationRequireWorker({ event: context.event as APIGatewayProxyEvent })
}

const requireWorker = createValidatorDirective(schema, validate)

export default requireWorker
