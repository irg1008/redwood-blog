import { valibotResolver } from '@hookform/resolvers/valibot'
import { Button, Input, Tooltip } from '@nextui-org/react'
import { ClipboardPasteIcon } from 'lucide-react'
import { confirmCodeSchema } from 'schemas/schemas'

import { FieldError, Form, Submit, useForm } from '@redwoodjs/forms'

import Controller, {
  ApolloError,
} from 'src/components/UI/Controller/Controller'

type ConfirmCodeInput = {
  code: string
}

type ConfirmCodeProps = {
  onConfirm?: (input: ConfirmCodeInput) => void
  error?: ApolloError
  loading?: boolean
}

const ConfirmCodeForm = ({ onConfirm, error, loading }: ConfirmCodeProps) => {
  const formMethods = useForm<ConfirmCodeInput>({
    mode: 'onTouched',
    defaultValues: {
      code: '',
    },
    resolver: valibotResolver(confirmCodeSchema),
  })

  const onSubmit = (data: ConfirmCodeInput) => {
    onConfirm?.(data)
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      formMethods.setValue('code', text)
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
    }
  }

  return (
    <Form<ConfirmCodeInput>
      onSubmit={onSubmit}
      error={error}
      formMethods={formMethods}
    >
      <Controller
        name="code"
        render={({ field, fieldState: { invalid } }) => (
          <Input
            {...field}
            type="number"
            label="Code"
            variant="bordered"
            placeholder="Enter the code you received in your email"
            isInvalid={invalid}
            endContent={
              <Tooltip content="Paste from clipboard">
                <Button
                  onClick={pasteFromClipboard}
                  isIconOnly
                  variant="light"
                  aria-label="Paste from clipboard"
                >
                  <ClipboardPasteIcon />
                </Button>
              </Tooltip>
            }
            errorMessage={<FieldError name="code" />}
          />
        )}
      />

      <Button
        color="primary"
        className="mt-6 w-full"
        as={Submit}
        isLoading={loading}
      >
        Confirm
      </Button>
    </Form>
  )
}

export default ConfirmCodeForm
