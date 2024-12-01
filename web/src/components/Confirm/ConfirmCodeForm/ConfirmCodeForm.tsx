import { valibotResolver } from '@hookform/resolvers/valibot'
import { Button, Input, Tooltip } from '@nextui-org/react'
import { ClipboardPasteIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { confirmCodeSchema } from 'schemas'

import { FieldError, Form, Submit } from '@redwoodjs/forms'

import Controller, {
  ApolloError,
} from 'src/components/UI/Controller/Controller'
import { useForm } from 'src/hooks/useForm'

type ConfirmCodeInput = {
  code: string
}

type ConfirmCodeProps = {
  onConfirm?: (input: ConfirmCodeInput) => void
  error?: ApolloError
  loading?: boolean
}

const ConfirmCodeForm = ({ onConfirm, error, loading }: ConfirmCodeProps) => {
  const { t } = useTranslation()

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
            label={t('confirm-code.form.code.label')}
            variant="bordered"
            placeholder={t('confirm-code.form.code.placeholder')}
            isInvalid={invalid}
            endContent={
              <Tooltip content={t('common.paste')}>
                <Button
                  onClick={pasteFromClipboard}
                  isIconOnly
                  variant="light"
                  aria-label={t('common.paste')}
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
        {t('confirm-code.actions.submit')}
      </Button>
    </Form>
  )
}

export default ConfirmCodeForm
