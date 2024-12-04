import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import type {
  ConfirmUserMutation,
  ConfirmUserMutationVariables,
  SendConfirmCodeMutation,
  SendConfirmCodeMutationVariables,
} from 'types/graphql'
import { TranslatePath } from 'types/i18next'

import { TypedDocumentNode, useMutation } from '@redwoodjs/web'

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
  onClose?: (success: boolean) => void
  isOpen: boolean
}

const ConfirmUserModal = ({
  onClose,
  email,
  isOpen,
}: ConfirmUserModalProps) => {
  const { t } = useTranslation()

  const [confirmUser, { loading, error, reset }] = useMutation(
    CONFIRM_USER_MUTATION,
    {
      onCompleted: async () => {
        toast.success(t('confirm-user.actions.confirm', { context: 'success' }))
        onClose?.(true)
      },
      onError: () => {},
    }
  )

  const [sendConfirmCode, { loading: loadingRequest }] = useMutation(
    SEND_CONFIRM_CODE_MUTATION,
    {
      onCompleted: () => {
        toast.success(
          t('confirm-user.actions.send-new', { context: 'success' }),
          {
            id: 'signup-confirm',
          }
        )
        reset()
      },
      onError: (error) => {
        const err = error.message as TranslatePath
        return toast.error(t([err, 'common.error'], { error: err }), {
          id: err,
        })
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
    <Modal isOpen={isOpen} onClose={() => onClose?.(false)}>
      <ModalContent>
        <ModalHeader className="line-clamp-1">
          {t('confirm-user.actions.confirm')} {email}
        </ModalHeader>

        <ModalBody>
          <ConfirmCodeForm
            error={error}
            loading={loading}
            onConfirm={onConfirm}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            className="ms-auto"
            isLoading={loadingRequest}
            variant="light"
            color="primary"
            onClick={sendNewConfirmCode}
          >
            {t('confirm-user.actions.send-new')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ConfirmUserModal
