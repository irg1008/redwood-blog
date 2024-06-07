import type {
  MutationResolvers,
  QueryResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { validate } from '@redwoodjs/api'
import { hashToken } from '@redwoodjs/auth-dbauth-api'

import { db } from 'src/lib/db'
import { sendConfirmAccountEmail } from 'src/services/mails/mails'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const confirmUser: MutationResolvers['confirmUser'] = async ({
  input: { email, code },
}) => {
  validate(email, 'email', { email: true })
  validate(code, 'code', { numericality: { integer: true } })

  const hashedCode = hashToken(code.toString())
  const user = await db.user.findFirst({
    where: { email, confirmToken: hashedCode },
  })

  validate(user, 'code', { presence: { message: 'The code is not valid' } })
  if (user.confirmed) return user

  validate(new Date() <= user.confirmTokenExpiresAt, 'code', {
    acceptance: { in: [true], message: 'The code has expired' },
  })

  return await db.user.update({
    where: { id: user.id },
    data: {
      confirmed: true,
      confirmToken: null,
      confirmTokenExpiresAt: null,
    },
  })
}

export const sendConfirmCode: MutationResolvers['sendConfirmCode'] = async ({
  email,
}) => {
  const user = await db.user.findUnique({ where: { email } })
  if (!user) throw new Error('No user found with this email address')

  const isStillValid = user.confirmTokenExpiresAt > new Date()
  if (isStillValid) return true

  const code = Math.floor(100000 + Math.random() * 900000)
  await sendConfirmAccountEmail({ email, code })

  await db.user.update({
    where: { email },
    data: {
      confirmToken: hashToken(code.toString()),
      confirmTokenExpiresAt: new Date(Date.now() + 2 * 60 * 1000),
    },
  })

  return true
}

export const User: UserRelationResolvers = {
  posts: (_obj, { root }) => {
    return db.user.findUnique({ where: { id: root?.id } }).posts()
  },
}
