import { useTranslation } from 'react-i18next'
import type { FindArticleQuery, FindArticleQueryVariables } from 'types/graphql'

import {
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
} from '@redwoodjs/web'

import Article from 'src/components/Article/Article'
import Spinner from 'src/components/UI/Spinner/Spinner'

export const QUERY: TypedDocumentNode<
  FindArticleQuery,
  FindArticleQueryVariables
> = gql`
  query FindArticleQuery($slug: String!) {
    article: post(slug: $slug) {
      id
      title
      slug
      body
      createdAt
      user {
        name
      }
    }
  }
`

export const Loading = Spinner

export const Empty = () => {
  const { t } = useTranslation()
  return <div>{t('article.empty')}</div>
}

export const Failure = ({
  error,
}: CellFailureProps<FindArticleQueryVariables>) => {
  const { t } = useTranslation()
  return (
    <div style={{ color: 'red' }}>
      {t('article.error')}{' '}
      {error && t('common.error', { error: error.message })}
    </div>
  )
}

export const Success = ({
  article,
}: CellSuccessProps<FindArticleQuery, FindArticleQueryVariables>) => {
  return <Article article={article} />
}
