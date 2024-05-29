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
  TextAreaField,
  TextField,
  useForm,
} from '@redwoodjs/forms'
import { Metadata, useMutation } from '@redwoodjs/web'
import { Toaster, toast } from '@redwoodjs/web/toast'

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

  const onSubmit = (data: CreateContactInput) => {
    createContact({
      variables: { input: data },
    })
  }

  return (
    <>
      <Metadata title="Contact" description="Contact page" />

      <Toaster />
      <Form<CreateContactInput>
        formMethods={formMethods}
        onSubmit={onSubmit}
        error={error}
      >
        <FormError error={error} wrapperClassName="form-error" />

        <Label name="name" errorClassName="error">
          Name
        </Label>
        <TextField name="name" errorClassName="error" />
        <FieldError name="name" className="error" />

        <Label name="email" errorClassName="error">
          Email
        </Label>
        <TextField
          name="email"
          validation={{
            required: true,
            pattern: {
              value: /^[^@]+@[^.]+\..+$/,
              message: 'Please enter a valid email address',
            },
          }}
          errorClassName="error"
        />
        <FieldError name="email" className="error" />

        <Label name="message" errorClassName="error">
          Message
        </Label>
        <TextAreaField
          name="message"
          validation={{ required: true }}
          errorClassName="error"
        />
        <FieldError name="message" className="error" />

        <Submit disabled={loading}>Save</Submit>
      </Form>
    </>
  )
}

export default ContactPage
