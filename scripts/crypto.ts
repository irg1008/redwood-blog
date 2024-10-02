import { createHash } from 'node:crypto'

const mdn = (data: string) => createHash('md5').update(data).digest('hex')

export default async () => {
  const challenge = 'b7e71511af735d5ebe56f720e9aedecf'
  console.log(mdn(mdn('mistserver_admin') + challenge))
}
