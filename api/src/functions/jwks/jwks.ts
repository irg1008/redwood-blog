import type { APIGatewayProxyHandler } from 'aws-lambda'

import { mediaJWKS } from 'src/lib/jwt'

export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(mediaJWKS),
  }
}
