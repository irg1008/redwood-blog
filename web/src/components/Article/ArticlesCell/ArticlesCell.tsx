import { useTranslation } from 'react-i18next'
import type { ArticlesQuery, ArticlesQueryVariables } from 'types/graphql'

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Article from 'src/components/Article/Article'
import Spinner from 'src/components/UI/Spinner/Spinner'

export const QUERY: TypedDocumentNode<ArticlesQuery, ArticlesQueryVariables> =
  gql`
    query ArticlesQuery {
      articles: posts {
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

export const Loading = () => <Spinner />

export const Empty = () => {
  const { t } = useTranslation()
  return <div>{t('articles.empty')}</div>
}

export const Failure = ({ error }: CellFailureProps) => {
  const { t } = useTranslation()
  return (
    <div style={{ color: 'red' }}>
      {t('articles.error')}{' '}
      {error && t('common.error', { error: error.message })}
    </div>
  )
}

export const Success = ({ articles }: CellSuccessProps<ArticlesQuery>) => {
  return (
    <div className="space-y-10">
      {articles.map((article) => (
        <Article key={article.id} article={article} summary={true} />
      ))}
    </div>
  )
}
