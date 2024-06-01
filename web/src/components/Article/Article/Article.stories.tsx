import type { Meta, StoryObj } from '@storybook/react'
import { FindArticleQuery } from 'types/graphql'

import Article from './Article'

const meta: Meta<typeof Article> = {
  component: Article,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Article>

const article: FindArticleQuery['article'] = {
  id: 1,
  user: {
    name: 'Alice',
  },
  title: 'RedwoodJS is the Best',
  body: `RedwoodJS is a full-stack framework for building web applications.
    It provides a seamless developer experience by integrating various technologies.
    These include React, GraphQL, and Prisma, among others.
    With RedwoodJS, you can build a scalable, production-ready application.
    It takes care of the boilerplate code, so you can focus on the business logic.
    RedwoodJS also has a strong community support.
    It is open-source and welcomes contributions from developers worldwide.
    The framework is designed with a focus on simplicity and developer productivity.
    If you're looking for a modern, full-stack solution for your next project, consider RedwoodJS.
    It's truly the best!`,
  slug: 'redwoodjs-is-the-best',
  createdAt: '2022-02-02T12:00:00Z',
}

export const full: Story = {
  args: { article },
}

export const summary: Story = {
  args: { article, summary: true },
}
