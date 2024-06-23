import { createKeyPair } from 'api/src/lib/jwt'

export default async () => {
  const { privateKey, publicKey } = await createKeyPair()
  console.log(publicKey)
  console.log(privateKey)
}
