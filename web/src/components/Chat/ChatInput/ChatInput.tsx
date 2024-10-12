import { useRef } from 'react'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { Button, Input } from '@nextui-org/react'
import { SendIcon } from 'lucide-react'
import { sendChatMessageSchema } from 'schemas'
import type {
  ChatMessageInput,
  SendChatMessageMutation,
  SendChatMessageMutationVariables,
} from 'types/graphql'

import { Form, Submit, useForm } from '@redwoodjs/forms'
import { TypedDocumentNode, useMutation } from '@redwoodjs/web'

import Controller from 'src/components/UI/Controller/Controller'

import { ChatMessagesCellProps } from '../ChatMessagesCell'

type ChatFormData = Pick<ChatMessageInput, 'body'>

export const SEND_CHAT_MESSAGE: TypedDocumentNode<
  SendChatMessageMutation,
  SendChatMessageMutationVariables
> = gql`
  mutation SendChatMessageMutation($input: ChatMessageInput!) {
    sendChatMessage(input: $input) {
      ...ChatMessageFragment
    }
  }
`

const ChatInput = ({ streamId }: ChatMessagesCellProps) => {
  const [sendChatMessage, { error }] = useMutation<
    SendChatMessageMutation,
    SendChatMessageMutationVariables
  >(SEND_CHAT_MESSAGE)

  const formMethods = useForm<ChatFormData>({
    mode: 'onTouched',
    defaultValues: {
      body: '',
    },
    resolver: valibotResolver(sendChatMessageSchema),
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const onMessageSent = async (data: ChatFormData) => {
    await sendChatMessage({
      variables: { input: { ...data, streamId } },
      onCompleted: () => {
        formMethods.reset()
        inputRef.current?.focus()
      },
    })
  }

  return (
    <Form<ChatFormData>
      formMethods={formMethods}
      error={error}
      onSubmit={onMessageSent}
      className="w-full"
    >
      <Controller
        name="body"
        render={({ field }) => (
          <Input
            {...field}
            ref={inputRef}
            type="text"
            size="md"
            color="primary"
            variant="bordered"
            placeholder="Type a message"
            endContent={
              <Button
                as={Submit}
                color="primary"
                variant="light"
                radius="lg"
                isIconOnly
              >
                <SendIcon className="size-5" />
              </Button>
            }
          />
        )}
      />
    </Form>
  )
}

export default ChatInput
