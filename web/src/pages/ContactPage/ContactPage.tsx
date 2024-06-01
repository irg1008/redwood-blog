import {
  CreateContactMutation,
  CreateContactInput,
  CreateContactMutationVariables,
} from 'types/graphql'

import {
  FieldError,
  Form,
  FormError,
  Label,
  Submit,
  SubmitHandler,
  TextAreaField,
  TextField,
  useForm,
} from '@redwoodjs/forms'
import { Metadata, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

const CREATE_CONTACT = gql`
  mutation CreateContactMutation($input: CreateContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

const ContactPage = () => {
  const formMethods = useForm<CreateContactInput>({ mode: 'onBlur' })

  const [createContact, { loading, error }] = useMutation<
    CreateContactMutation,
    CreateContactMutationVariables
  >(CREATE_CONTACT, {
    onCompleted: () => {
      toast.success('Thank you for your submission!')
      formMethods.reset()
    },
  })

  const onSubmit: SubmitHandler<CreateContactInput> = (data) => {
    createContact({
      variables: { input: data },
    })
  }

  return (
    <>
      <Metadata title="Contact" description="Contact page" />

      <h3 className="text-lg font-light text-gray-600">Leave a Comment</h3>
      <Form<CreateContactInput>
        className="mt-4 w-full"
        onSubmit={onSubmit}
        error={error}
        formMethods={formMethods}
      >
        <FormError
          error={error}
          wrapperClassName="py-4 px-6 rounded-lg bg-red-100 text-red-700"
          listClassName="list-disc ml-4"
        />

        <Label
          name="name"
          className="block text-sm uppercase text-gray-600"
          errorClassName="block uppercase text-sm text-red-700"
        >
          Name
        </Label>
        <TextField
          name="name"
          className="block w-full rounded border p-1 text-xs outline-none"
          errorClassName="block w-full rounded border p-1 text-xs border border-red-700 outline-none"
        />
        <FieldError name="name" className="block text-red-700" />

        <Label
          name="email"
          className="mt-8 block text-sm uppercase text-gray-700"
          errorClassName="block mt-8 text-red-700 uppercase text-sm"
        >
          Email
        </Label>
        <TextField
          name="email"
          validation={{
            required: true,
            pattern: {
              value: /[^@]+@[^.]+\..+/,
              message: 'Please enter a valid email address',
            },
          }}
          className="block w-full rounded border p-1 text-xs outline-none"
          errorClassName="block w-full rounded border p-1 text-xs border border-red-700 outline-none"
        />
        <FieldError name="email" className="block text-red-700" />

        <Label
          name="message"
          className="mt-8 block text-sm uppercase text-gray-700"
          errorClassName="block mt-8 text-red-700 uppercase text-sm"
        >
          Message
        </Label>
        <TextAreaField
          name="message"
          validation={{ required: true }}
          className="block h-24 w-full rounded border p-1 text-xs outline-none"
          errorClassName="block h-24 w-full rounded border p-1 text-xs border border-red-700 outline-none"
        />
        <FieldError name="message" className="block text-red-700" />

        <Submit
          disabled={loading}
          className="mt-4 block rounded bg-blue-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white disabled:opacity-50"
        >
          Save
        </Submit>
      </Form>
    </>
  )
}

export default ContactPage
