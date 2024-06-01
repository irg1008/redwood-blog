import {
  CreateCommentInput,
  CreateCommentMutation,
  CreateCommentMutationVariables,
} from 'types/graphql'

import {
  Form,
  Label,
  TextField,
  TextAreaField,
  Submit,
  useForm,
  SubmitHandler,
  FormError,
  FieldError,
} from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/dist/toast'

import { QUERY as CommentsQuery } from 'src/components/Comment/CommentsCell/CommentsCell'

const CREATE_COMMENT = gql`
  mutation CreateCommentMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      name
      body
      createdAt
    }
  }
`

type CommentFormValues = Pick<CreateCommentInput, 'name' | 'body'>

type CommentFormProps = {
  postId: CreateCommentInput['postId']
}

const CommentForm = ({ postId }: CommentFormProps) => {
  const formMethods = useForm<CommentFormValues>({ mode: 'onBlur' })

  const [createComment, { loading, error }] = useMutation<
    CreateCommentMutation,
    CreateCommentMutationVariables
  >(CREATE_COMMENT, {
    onCompleted: () => {
      toast.success('Thank you for your comment!')
      formMethods.reset()
    },
    refetchQueries: [
      {
        query: CommentsQuery,
        variables: { postId },
      },
    ],
  })

  const onSubmit: SubmitHandler<CommentFormValues> = (input) => {
    createComment({ variables: { input: { postId, ...input } } })
  }

  return (
    <div>
      <h3 className="text-lg font-light text-gray-600">Leave a Comment</h3>
      <Form<CommentFormValues>
        className="mt-4 w-full"
        formMethods={formMethods}
        onSubmit={onSubmit}
        error={error}
      >
        <FormError
          error={error}
          wrapperClassName="py-4 px-6 rounded-lg bg-red-100 text-red-700"
          listClassName="list-disc ml-4"
        />

        <Label
          name="name"
          className="mt-8 block text-sm uppercase text-gray-700"
          errorClassName="block mt-8 text-red-700 uppercase text-sm"
        >
          Name
        </Label>
        <TextField
          name="name"
          className="block w-full rounded border p-1 text-xs"
          errorClassName="block w-full rounded border p-1 text-xs border border-red-700 outline-none"
          validation={{ required: true }}
        />
        <FieldError name="name" className="block text-red-700" />

        <Label
          name="body"
          className="mt-8 block text-sm uppercase text-gray-700"
          errorClassName="block mt-8 text-red-700 uppercase text-sm"
        >
          Comment
        </Label>
        <TextAreaField
          name="body"
          className="block h-24 w-full rounded border p-1 text-xs"
          errorClassName="block h-24 w-full rounded border p-1 text-xs border border-red-700 outline-none"
          validation={{ required: true }}
        />
        <FieldError name="body" className="block text-red-700" />

        <Submit
          disabled={loading}
          className="mt-4 block rounded bg-blue-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-50"
        >
          Submit
        </Submit>
      </Form>
    </div>
  )
}

export default CommentForm
