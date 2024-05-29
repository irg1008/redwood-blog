import type { FindPostBySlug, FindPostBySlugVariables } from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Post from 'src/components/Post/Post'

export const QUERY: TypedDocumentNode<
  FindPostBySlug,
  FindPostBySlugVariables
> = gql`
  query FindPostBySlug($slug: String!) {
    post: post(slug: $slug) {
      id
      title
      slug
      body
      createdAt
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Post not found</div>

export const Failure = ({ error }: CellFailureProps<FindPostBySlugVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  post,
}: CellSuccessProps<FindPostBySlug, FindPostBySlugVariables>) => {
  return <Post post={post} />
}
