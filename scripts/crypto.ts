import { createHash } from 'node:crypto'

const mdn = (data: string) => createHash('md5').update(data).digest('hex')

export default async () => {
  const challenge = '48d878ab3659c0a1611e3861f4bbf476'
  console.log(mdn(mdn('mistserver_admin') + challenge))
}
