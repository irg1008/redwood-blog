import {
  DeleteCommentMutation,
  DeleteCommentMutationVariables,
  Comment as TComment,
} from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { QUERY as CommentsQuery } from 'src/components/Comment/CommentsCell/CommentsCell'
import { useAuth } from 'src/lib/auth'

const DELETE_COMMENT = gql`
  mutation DeleteCommentMutation($id: Int!) {
    deleteComment(id: $id) {
      postId
    }
  }
`

type CommentProps = {
  comment: Omit<TComment, 'post'>
}

const Comment = ({ comment }: CommentProps) => {
  const { hasRole } = useAuth()

  const [deleteComment] = useMutation<
    DeleteCommentMutation,
    DeleteCommentMutationVariables
  >(DELETE_COMMENT, {
    refetchQueries: [
      {
        query: CommentsQuery,
        variables: { postId: comment.postId },
      },
    ],
  })

  const confirmDeleteComment = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment({ variables: { id: comment.id } })
    }
  }

  return (
    <div className="relative rounded-lg bg-gray-200 p-8">
      <header className="flex justify-between">
        <h2 className="font-semibold text-gray-700">{comment.name}</h2>
        <time className="text-xs text-gray-500" dateTime={comment.createdAt}>
          {comment.createdAt}
        </time>
      </header>
      <p className="mt-2 text-sm">{comment.body}</p>
      {hasRole(['moderator', 'admin']) && (
        <button
          type="button"
          onClick={confirmDeleteComment}
          className="absolute bottom-2 right-2 rounded bg-red-500 px-2 py-1 text-xs text-white"
        >
          Delete
        </button>
      )}
    </div>
  )
}

export default Comment
