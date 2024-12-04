import { confirmUserSchema, v } from 'schemas'
import type {
  MutationResolvers,
  QueryResolvers,
  UserRelationResolvers,
} from 'types/graphql'

import { validate } from '@redwoodjs/api'
import { hashToken } from '@redwoodjs/auth-dbauth-api'

import { LanguageContext } from 'src/i18n/i18n'
import { SendConfirmUserEmailJob } from 'src/jobs/SendConfirmUserEmailJob/SendConfirmUserEmailJob'
import { SendResetPasswordEmailJob } from 'src/jobs/SendResetPasswordEmailJob/SendResetPasswordEmailJob'
import { db } from 'src/lib/db'
import { later } from 'src/lib/jobs'

import { TranslatePath } from '$web/src/i18n/i18n'

export const users: QueryResolvers['users'] = () => {
  return db.user.findMany()
}

export const user: QueryResolvers['user'] = ({ id }) => {
  return db.user.findUnique({
    where: { id },
  })
}

export const confirmUser: MutationResolvers['confirmUser'] = async ({
  input,
}) => {
  const { email, code } = input
  v.parse(confirmUserSchema, input)

  const hashedCode = hashToken(code.toString())
  const user = await db.user.findFirst({
    where: { email, confirmToken: hashedCode },
  })

  validate(user, 'code', {
    presence: {
      message: 'confirm-user.errors.code.invalid' satisfies TranslatePath,
    },
  })

  if (user?.confirmed) return user

  validate(
    user?.confirmTokenExpiresAt && new Date() <= user.confirmTokenExpiresAt,
    'code',
    {
      acceptance: {
        in: [true],
        message: 'confirm-user.errors.code.expired' satisfies TranslatePath,
      },
    }
  )

  return await db.user.update({
    where: { id: user?.id },
    data: {
      confirmed: true,
      confirmToken: null,
      confirmTokenExpiresAt: null,
    },
  })
}

const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000)
}

export const sendConfirmCode: MutationResolvers<LanguageContext>['sendConfirmCode'] =
  async ({ email }, global) => {
    const user = await db.user.findUnique({
      where: { email },
    })
    if (!user) {
      throw new Error(
        'confirm-user.errors.username.not-found' satisfies TranslatePath
      )
    }

    const isStillValid =
      user.confirmTokenExpiresAt && user.confirmTokenExpiresAt > new Date()
    if (isStillValid) return true

    const code = generateCode()
    const lang = global?.context.req.language
    await later(SendConfirmUserEmailJob, [{ email, code }, lang])

    await db.user.update({
      where: { email },
      data: {
        confirmToken: hashToken(code.toString()),
        confirmTokenExpiresAt: new Date(Date.now() + 2 * 60 * 1000),
      },
    })

    return true
  }

export const sendResetPassword = async (
  data: {
    email: string
    resetToken: string
  },
  { context }: { context: LanguageContext }
) => {
  const lang = context.req.language
  await later(SendResetPasswordEmailJob, [data, lang])
}

export const User: UserRelationResolvers = {
  posts: (_obj, { root }) => {
    return db.user.findUniqueOrThrow({ where: { id: root?.id } }).posts()
  },
}
