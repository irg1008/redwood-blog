import { valibotResolver } from '@hookform/resolvers/valibot'
import { Button, Input } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { confirmCodeSchema } from 'schemas'
import { TranslatePath } from 'types/i18next'

import { Form, Submit } from '@redwoodjs/forms'

import Controller, {
  ApolloError,
} from 'src/components/UI/Controller/Controller'
import CopyPasteButton from 'src/components/UI/CopyPasteButton/CopyPasteButton'
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

  return (
    <Form<ConfirmCodeInput>
      onSubmit={onSubmit}
      error={error}
      formMethods={formMethods}
      className="flex flex-col gap-4"
    >
      <Controller
        name="code"
        render={({ field, fieldState: { invalid, error } }) => (
          <Input
            {...field}
            type="number"
            label={t('confirm-code.form.code.label')}
            variant="bordered"
            placeholder={t('confirm-code.form.code.placeholder')}
            isInvalid={invalid}
            endContent={
              <CopyPasteButton
                onPaste={(text) => {
                  formMethods.setValue('code', text)
                  formMethods.trigger('code')
                }}
              />
            }
            errorMessage={error && t(error.message as TranslatePath)}
          />
        )}
      />

      <Button color="primary" as={Submit} isLoading={loading}>
        {t('confirm-code.actions.submit')}
      </Button>
    </Form>
  )
}

export default ConfirmCodeForm
