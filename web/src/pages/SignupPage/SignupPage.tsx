import { useEffect, useRef, useState } from 'react'

import { valibotResolver } from '@hookform/resolvers/valibot'
import { Button, Divider, Input } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { signupSchema } from 'schemas'
import { TranslatePath } from 'types/i18next'

import { SignupAttributes } from '@redwoodjs/auth-dbauth-web'
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

const SignupPage = () => {
  const { t } = useTranslation()

  const formMethods = useForm<SignupAttributes>({
    mode: 'onBlur',
    defaultValues: {
      password: '',
      username: '',
    },
    resolver: valibotResolver(signupSchema),
  })

  const { isAuthenticated, signUp, logIn, loading } = useAuth()
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.home())
    }
  }, [isAuthenticated])

  // focus on username box on page load
  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const onSubmit = async (data: SignupAttributes) => {
    const response = await signUp(data)
    const err: TranslatePath = response.error

    if (err) {
      return toast.error(t([err, 'common.error'], { ...data, error: err }), {
        id: err,
      })
    }

    toast.success(t('Signup.actions.confirm-user'), {
      id: 'signup-confirm',
    })

    setConfirmOpen(true)
  }

  const onUserConfirmed = async (success: boolean) => {
    setConfirmOpen(false)
    if (!success) return

    const response = await logIn(formMethods.getValues())
    if (response.error) {
      return toast.error(response.error)
    }
  }

  return (
    <>
      <Metadata
        title={t('Signup.title')}
        description={t('Signup.description')}
      />

      <section className="grid w-full grow place-content-center gap-8 p-16">
        <header className="text-center">
          <h2 className="text-4xl text-primary">{t('common.name')}</h2>
        </header>

        <Form<SignupAttributes>
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
                label={t('Signup.form.username.label')}
                variant="bordered"
                placeholder={t('Signup.form.username.placeholder')}
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
                label={t('Signup.form.password.label')}
                autoComplete="new-password"
                variant="bordered"
                placeholder={t('Signup.form.password.placeholder')}
                isInvalid={invalid}
                errorMessage={<FieldError name="password" />}
              />
            )}
          />

          <Button color="primary" as={Submit} isLoading={loading}>
            {t('Signup.actions.submit')}
          </Button>

          <footer className="mt-2 flex justify-between">
            <span className="text-sm">
              {t('Signup.already-account')}{' '}
              <Link size="sm" to={routes.login()} underline="hover">
                {t('Signup.actions.login')}
              </Link>
            </span>
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

export default SignupPage
