import { Spinner } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import type { CommentsQuery, CommentsQueryVariables } from 'types/graphql'

import type {
  CellFailureProps,
  CellSuccessProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import Comment from 'src/components/Comment/Comment'

export const QUERY: TypedDocumentNode<CommentsQuery, CommentsQueryVariables> =
  gql`
    query CommentsQuery($postId: Int!) {
      comments(postId: $postId) {
        id
        name
        body
        postId
        createdAt
      }
    }
  `

export const Loading = () => <Spinner />

export const Empty = () => {
  const { t } = useTranslation()
  return <div className="text-center text-gray-500">{t('comments.empty')}</div>
}

export const Failure = ({ error }: CellFailureProps) => {
  const { t } = useTranslation()

  return (
    <div style={{ color: 'red' }}>
      {t('comments.error')}{' '}
      {error && t('common.error', { error: error.message })}
    </div>
  )
}

export const Success = ({ comments }: CellSuccessProps<CommentsQuery>) => {
  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
