import { useEffect, useRef, useState } from 'react'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { Button, Divider, Input } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { loginSchema } from 'schemas'
import { TranslatePath } from 'types/i18next'

import { LoginAttributes } from '@redwoodjs/auth-dbauth-web'
import { FieldError, Form, Submit } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import ConfirmUserModal from 'src/components/Confirm/ConfirmUserModal/ConfirmUserModal'
import SocialLogin from 'src/components/SocialLogin/SocialLogin'
import Controller from 'src/components/UI/Controller/Controller'
import Link from 'src/components/UI/Link/Link'
import { useForm } from 'src/hooks/useForm'

const LoginPage = () => {
  const { t } = useTranslation()

  const formMethods = useForm<LoginAttributes>({
    mode: 'onBlur',
    defaultValues: {
      password: '',
      username: '',
    },
    resolver: valibotResolver(loginSchema),
  })

  const { isAuthenticated, logIn, loading } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const onSubmit = async (data: LoginAttributes) => {
    const response = await logIn(data)
    if (!response.error) return

    const err: TranslatePath = response.error
    const message = t([err, 'common.error'], { ...data, error: err })

    switch (err) {
      case 'Login.actions.confirm-user': {
        setConfirmOpen(true)
        return toast.success(message, { id: 'login-confirm' })
      }
      case 'Login.errors.username.not-found': {
        return formMethods.setError('username', { message })
      }
      case 'Login.errors.password.incorrect': {
        return formMethods.setError('password', { message })
      }
      default: {
        return toast.error(message, { id: err })
      }
    }
  }

  const onUserConfirmed = (success: boolean) => {
    setConfirmOpen(false)
    if (success) {
      onSubmit(formMethods.getValues())
    }
  }

  return (
    <>
      <Metadata title={t('Login.title')} description={t('Login.description')} />

      <section className="grid w-full grow place-content-center gap-8 p-16">
        <header className="text-center">
          <h2 className="text-4xl text-primary">{t('common.name')}</h2>
        </header>

        <Form<LoginAttributes>
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
                label={t('Login.form.username.label')}
                variant="bordered"
                placeholder={t('Login.form.username.placeholder')}
                isInvalid={invalid}
                errorMessage={<FieldError name="username" />}
              />
            )}
          />

          <Controller
            name="password"
            render={({ field, fieldState: { invalid } }) => (
              <Input
                {...field}
                type="password"
                label={t('Login.form.password.label')}
                autoComplete="current-password"
                variant="bordered"
                placeholder={t('Login.form.password.placeholder')}
                isInvalid={invalid}
                errorMessage={<FieldError name="password" />}
              />
            )}
          />

          <Button color="primary" as={Submit} isLoading={loading}>
            {t('Login.actions.submit')}
          </Button>

          <footer className="mt-2 flex justify-between">
            <span className="text-sm">
              {t('Login.no-account')}{' '}
              <Link size="sm" to={routes.signup()} underline="hover">
                {t('Login.actions.signup')}
              </Link>
            </span>

            <Link
              size="sm"
              to={routes.forgotPassword()}
              underline="hover"
              className="text-end"
            >
              {t('Login.actions.forgot-password')}
            </Link>
          </footer>
        </Form>

        <Divider />

        <SocialLogin />
      </section>

      <ConfirmUserModal
        isOpen={confirmOpen}
        email={formMethods.getValues().username}
        onClose={onUserConfirmed}
      />
    </>
  )
}

export default LoginPage
