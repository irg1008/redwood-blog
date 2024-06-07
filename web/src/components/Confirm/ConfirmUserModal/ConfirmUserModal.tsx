import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import type {
  ConfirmUserMutation,
  ConfirmUserMutationVariables,
  SendConfirmCodeMutation,
  SendConfirmCodeMutationVariables,
} from 'types/graphql'

import { TypedDocumentNode, useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ConfirmCodeForm from 'src/components/Confirm/ConfirmCodeForm/ConfirmCodeForm'

export const CONFIRM_USER_MUTATION: TypedDocumentNode<
  ConfirmUserMutation,
  ConfirmUserMutationVariables
> = gql`
  mutation ConfirmUserMutation($input: ConfirmUserInput!) {
    confirmUser(input: $input) {
      id
    }
  }
`

export const SEND_CONFIRM_CODE_MUTATION: TypedDocumentNode<
  SendConfirmCodeMutation,
  SendConfirmCodeMutationVariables
> = gql`
  mutation SendConfirmCodeMutation($email: String!) {
    sendConfirmCode(email: $email)
  }
`

type ConfirmUserModalProps = {
  email: string
  onClose?: (success?: boolean) => void
  isOpen: boolean
}

const ConfirmUserModal = ({
  onClose,
  email,
  isOpen,
}: ConfirmUserModalProps) => {
  const [confirmUser, { loading, error, reset }] = useMutation(
    CONFIRM_USER_MUTATION,
    {
      onCompleted: async () => {
        toast.success('Confirmed successfully!')
        onClose?.(true)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const [sendConfirmCode, { loading: loadingRequest }] = useMutation(
    SEND_CONFIRM_CODE_MUTATION,
    {
      onCompleted: () => {
        toast.success('We just sent a new code to your email inbox', {
          id: 'signup-confirm',
        })
        reset()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onConfirm = async (input: { code: string }) => {
    await confirmUser({
      variables: { input: { email, code: parseInt(input.code) } },
    })
  }

  const sendNewConfirmCode = async () => {
    await sendConfirmCode({ variables: { email } })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="line-clamp-1">Confirm {email}</ModalHeader>

        <ModalBody>
          <ConfirmCodeForm
            error={error}
            loading={loading}
            onConfirm={onConfirm}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            className="me-auto"
            isLoading={loadingRequest}
            variant="light"
            color="primary"
            onClick={sendNewConfirmCode}
          >
            Send a new code
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ConfirmUserModal
