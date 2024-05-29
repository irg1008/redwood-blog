import type { ArticlesQuery, ArticlesQueryVariables } from 'types/graphql'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import Article from 'src/components/Article/Article/Article'

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
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ articles }: CellSuccessProps<ArticlesQuery>) => {
  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>
          <Article article={article} />
        </li>
      ))}
    </ul>
  )
}
