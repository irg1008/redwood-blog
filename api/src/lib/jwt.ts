import {
  JSONWebKeySet,
  JWK,
  JWTPayload,
  SignJWT,
  createLocalJWKSet,
  exportJWK,
  exportPKCS8,
  generateKeyPair,
  importPKCS8,
  jwtVerify,
} from 'jose'

export const ALG = 'PS256'
export const KID = 'base'

export const createKeyPair = async () => {
  const { privateKey, publicKey } = await generateKeyPair(ALG)
  return {
    privateKey: await exportPKCS8(privateKey),
    publicKey: await exportJWK(publicKey),
  }
}

export const privateKey = async () => {
  return await importPKCS8(process.env.JWT_PRIVATE_KEY, ALG)
}

export const signJwt = async (
  payload: JWTPayload,
  signCb?: (sign: SignJWT) => void
) => {
  const key = await privateKey()
  const sign = new SignJWT(payload)
  if (signCb) signCb(sign)
  return sign.setProtectedHeader({ alg: ALG, kid: KID }).setIssuedAt().sign(key)
}

export const verifyJwt = async (token: string) => {
  const key = await privateKey()
  return jwtVerify(token, key)
}

export const publicVerifyJwt = async (token: string) => {
  const jwks = createLocalJWKSet(mediaJWKS)
  return jwtVerify(token, jwks)
}

const mediaJWK: JWK = {
  kid: KID,
  kty: 'RSA',
  e: 'AQAB',
  n: process.env.JWT_PUBLIC_KEY,
  alg: ALG,
}

export const mediaJWKS: JSONWebKeySet = {
  keys: [mediaJWK],
}
