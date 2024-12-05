import { useCallback, useEffect } from 'react'

import type {
  CreatePostInput,
  EditPostById
} from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  FieldError,
  Form,
  FormError,
  Label,
  Submit,
  TextField,
} from '@redwoodjs/forms'

import { useForm } from 'src/hooks/useForm'

type FormPost = NonNullable<EditPostById['post']>

type PostFormProps = {
  post?: EditPostById['post']
  onSave: (data: CreatePostInput) => void
  error?: RWGqlError
  loading: boolean
}

const PostForm = (props: PostFormProps) => {
  const formMethods = useForm<FormPost>({ mode: 'onBlur' })
  const title = formMethods.watch('title')

  const setSlug = useCallback(
    (value: string) => {
      const formattedValue = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
      formMethods.setValue('slug', formattedValue)
    },
    [formMethods]
  )

  useEffect(() => {
    if (title) setSlug(title)
  }, [title, setSlug])

  return (
    <div className="rw-form-wrapper">
      <Form<FormPost>
        formMethods={formMethods}
        onSubmit={props.onSave}
        error={props.error}
      >
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="title"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Title
        </Label>

        <TextField
          name="title"
          defaultValue={props.post?.title}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="title" className="rw-field-error" />

        <Label
          name="slug"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Slug
        </Label>

        <TextField
          name="slug"
          defaultValue={props.post?.slug}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="slug" className="rw-field-error" />

        <Label
          name="body"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Body
        </Label>

        <TextField
          name="body"
          defaultValue={props.post?.body}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="body" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default PostForm
