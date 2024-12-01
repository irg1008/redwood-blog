import { useEffect, useRef, useState } from 'react'

import { LoginAttributes } from '@redwoodjs/auth-dbauth-web'
import {
  FieldError,
  Form,
  Label,
  PasswordField,
  Submit,
  TextField,
} from '@redwoodjs/forms'
import { Link, navigate, routes, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ConfirmUserModal from 'src/components/Confirm/ConfirmUserModal/ConfirmUserModal'
import SocialLogin from 'src/components/SocialLogin/SocialLogin'
import { useForm } from 'src/hooks/useForm'
import { useAuth } from 'src/lib/auth'

const LoginPage = () => {
  const formMethods = useForm<LoginAttributes>({ mode: 'onBlur' })
  const { isAuthenticated, logIn } = useAuth()
  const { error } = useParams()
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

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

    if (response.message) {
      return toast(response.message)
    }

    if (response.error === 'confirmUser') {
      setConfirmOpen(true)
      return toast.success('Check your inbox for a confirmation code', {
        id: 'login-confirm',
      })
    }

    if (response.error) {
      return toast.error(response.error)
    }
  }

  const onUserConfirmed = (success: boolean) => {
    setConfirmOpen(false)
    if (success) onSubmit(formMethods.getValues())
  }

  return (
    <>
      <Metadata title="Login" />

      <main className="rw-main">
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">Login</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form
                  onSubmit={onSubmit}
                  className="rw-form-wrapper"
                  formMethods={formMethods}
                >
                  <Label
                    name="username"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Username
                  </Label>
                  <TextField
                    name="username"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={usernameRef}
                    validation={{
                      required: {
                        value: true,
                        message: 'Username is required',
                      },
                    }}
                  />

                  <FieldError name="username" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    Password
                  </Label>
                  <PasswordField
                    name="password"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: 'Password is required',
                      },
                    }}
                  />
                  <FieldError name="password" className="rw-field-error" />

                  <div className="rw-forgot-link">
                    <Link
                      to={routes.forgotPassword()}
                      className="rw-forgot-link"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">Login</Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>{`Don't have an account?`}</span>{' '}
            <Link to={routes.signup()} className="rw-link">
              Sign up!
            </Link>
          </div>
        </div>

        <ConfirmUserModal
          isOpen={confirmOpen}
          email={formMethods.getValues().username}
          onClose={onUserConfirmed}
        />

        <SocialLogin />
      </main>
    </>
  )
}

export default LoginPage
