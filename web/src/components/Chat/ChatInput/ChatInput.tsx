import { valibotResolver } from '@hookform/resolvers/valibot'
import { Button, Input } from '@nextui-org/react'
import { SendIcon } from 'lucide-react'
import { sendChatMessageSchema } from 'schemas/schemas'
import type {
  ChatMessageInput,
  SendChatMessageMutation,
  SendChatMessageMutationVariables,
} from 'types/graphql'

import { FieldError, Form, Submit, useForm } from '@redwoodjs/forms'
import { TypedDocumentNode, useMutation } from '@redwoodjs/web'

import Controller from 'src/components/UI/Controller/Controller'

type ChatInputProps = Pick<ChatMessageInput, 'chatRoomId'>
type ChatFromData = Pick<ChatMessageInput, 'body'>

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

const ChatInput = ({ chatRoomId }: ChatInputProps) => {
  const [sendChatMessage, { error }] = useMutation<
    SendChatMessageMutation,
    SendChatMessageMutationVariables
  >(SEND_CHAT_MESSAGE)

  const formMethods = useForm<ChatFromData>({
    mode: 'onTouched',
    defaultValues: {
      body: '',
    },
    resolver: valibotResolver(sendChatMessageSchema),
  })

  const onMessageSent = async (data: ChatFromData) => {
    await sendChatMessage({
      variables: { input: { ...data, chatRoomId } },
      onCompleted: () => {
        formMethods.reset()
      },
    })
  }

  return (
    <Form<ChatFromData>
      formMethods={formMethods}
      error={error}
      onSubmit={onMessageSent}
    >
      <Controller
        name="body"
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label="Message"
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
                <SendIcon className="s-5" />
              </Button>
            }
            errorMessage={<FieldError name="body" />}
          />
        )}
      />
    </Form>
  )
}

export default ChatInput
