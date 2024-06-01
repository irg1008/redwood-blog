import type { ArticlesQuery, ArticlesQueryVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Article from 'src/components/Article/Article'

export const QUERY: TypedDocumentNode<
  ArticlesQuery,
  ArticlesQueryVariables
> = gql`
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

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return <div>No posts to show</div>
}

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ articles }: CellSuccessProps<ArticlesQuery>) => {
  return (
    <div className="space-y-10">
      {articles.map((article) => (
        <Article key={article.id} article={article} summary={true} />
      ))}
    </div>
  )
}
