import { useEffect, useRef } from 'react'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { Button, Input, Link } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { forgotPasswordSchema } from 'schemas'
import { TranslatePath } from 'types/i18next'

import { LoginAttributes } from '@redwoodjs/auth-dbauth-web'
import { FieldError, Form, Submit } from '@redwoodjs/forms'
import { back, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import Controller from 'src/components/UI/Controller/Controller'
import { useForm } from 'src/hooks/useForm'
import { useAuth } from 'src/lib/auth'

type ForgotPasswordForm = Pick<LoginAttributes, 'username'>

const ForgotPasswordPage = () => {
  const { t } = useTranslation()

  const formMethods = useForm<ForgotPasswordForm>({
    mode: 'onBlur',
    defaultValues: {
      username: '',
    },
    resolver: valibotResolver(forgotPasswordSchema),
  })

  const { isAuthenticated, forgotPassword, loading } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    usernameRef?.current?.focus()
  }, [])

  const onSubmit = async (data: ForgotPasswordForm) => {
    const response = await forgotPassword(data.username)

    if (response.error) {
      const err: TranslatePath = response.error
      return toast.error(t([err, 'common.error'], { ...data, error: err }), {
        id: err,
      })
    }

    toast.success(
      t('ForgotPassword.actions.submit', { context: 'success', ...data })
    )

    formMethods.reset()
  }

  return (
    <>
      <Metadata
        title={t('ForgotPassword.title')}
        description={t('ForgotPassword.description')}
      />

      <section className="grid w-full grow place-content-center gap-8 p-16">
        <header className="text-center">
          <h2 className="text-4xl text-primary">{t('common.name')}</h2>
        </header>

        <Form<ForgotPasswordForm>
          onSubmit={onSubmit}
          formMethods={formMethods}
          className="flex w-72 flex-col gap-4"
        >
          <Controller
            name="username"
            render={({ field, fieldState: { invalid } }) => (
              <Input
                {...field}
                type="text"
                ref={usernameRef}
                label={t('ForgotPassword.form.username.label')}
                variant="bordered"
                placeholder={t('ForgotPassword.form.username.placeholder')}
                isInvalid={invalid}
                errorMessage={<FieldError name="username" />}
              />
            )}
          />

          <Button color="primary" as={Submit} isLoading={loading}>
            {t('ForgotPassword.actions.submit')}
          </Button>

          <footer className="mt-2 grid">
            <Link
              size="sm"
              onClick={() => back()}
              underline="hover"
              className="cursor-pointer justify-self-end"
            >
              {t('ForgotPassword.actions.go-back')}
            </Link>
          </footer>
        </Form>
      </section>
    </>
  )
}

export default ForgotPasswordPage
