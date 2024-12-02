import { useEffect, useRef } from 'react'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { Button, Input } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { resetPasswordSchema } from 'schemas'
import { TranslatePath } from 'types/i18next'

import { ResetPasswordAttributes } from '@redwoodjs/auth-dbauth-web'
import { FieldError, Form, Submit } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import Controller from 'src/components/UI/Controller/Controller'
import Link from 'src/components/UI/Link/Link'
import { useForm } from 'src/hooks/useForm'
import { useAuth } from 'src/lib/auth'

type ResetPasswordForm = Pick<ResetPasswordAttributes, 'password'>

const ResetPasswordPage = ({ resetToken }: { resetToken: string }) => {
  const { t } = useTranslation()

  const formMethods = useForm<ResetPasswordForm>({
    mode: 'onBlur',
    defaultValues: {
      password: '',
    },
    resolver: valibotResolver(resetPasswordSchema),
  })

  const {
    isAuthenticated,
    reauthenticate,
    validateResetToken,
    resetPassword,
    loading,
  } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  useEffect(() => {
    const validateToken = async () => {
      const response = await validateResetToken(resetToken)

      const err: TranslatePath = response.error
      if (!err) return

      navigate(routes.home(), { replace: true })
      toast.error(t([err, 'common.error'], { error: err }), {
        id: err,
      })
    }

    validateToken()
  }, [resetToken, validateResetToken, t])

  const passwordRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    passwordRef.current?.focus()
  }, [])

  const onSubmit = async (data: ResetPasswordForm) => {
    const response = await resetPassword({
      resetToken,
      password: data.password,
    })

    const err: TranslatePath = response.error
    if (response.error) {
      return toast.error(t([err, 'common.error'], { error: err }), {
        id: err,
      })
    }

    toast.success(t('ResetPassword.actions.submit', { context: 'success' }))

    await reauthenticate()
    navigate(routes.login())
  }

  return (
    <>
      <Metadata
        title={t('ResetPassword.title')}
        description={t('ResetPassword.description')}
      />

      <section className="grid w-full grow place-content-center gap-8 p-16">
        <header className="text-center">
          <h2 className="text-4xl text-primary">{t('common.name')}</h2>
        </header>

        <Form<ResetPasswordForm>
          onSubmit={onSubmit}
          formMethods={formMethods}
          className="flex w-72 flex-col gap-4"
        >
          <Controller
            name="password"
            render={({ field, fieldState: { invalid } }) => (
              <Input
                {...field}
                type="password"
                ref={passwordRef}
                autoComplete="new-password"
                label={t('ResetPassword.form.password.label')}
                variant="bordered"
                placeholder={t('ResetPassword.form.password.placeholder')}
                isInvalid={invalid}
                errorMessage={<FieldError name="password" />}
              />
            )}
          />

          <Button color="primary" as={Submit} isLoading={loading}>
            {t('ResetPassword.actions.submit')}
          </Button>

          <footer className="mt-2 grid">
            <Link
              size="sm"
              to={routes.login()}
              underline="hover"
              className="justify-self-end"
            >
              {t('ResetPassword.actions.navigate-login')}
            </Link>
          </footer>
        </Form>
      </section>
    </>
  )
}

export default ResetPasswordPage
