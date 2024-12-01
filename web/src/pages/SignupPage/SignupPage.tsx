import { useEffect, useRef, useState } from 'react'

import { SignupAttributes } from '@redwoodjs/auth-dbauth-web'
import {
  FieldError,
  Form,
  Label,
  PasswordField,
  Submit,
  TextField,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import ConfirmUserModal from 'src/components/Confirm/ConfirmUserModal/ConfirmUserModal'
import SocialLogin from 'src/components/SocialLogin/SocialLogin'
import { useForm } from 'src/hooks/useForm'
import { useAuth } from 'src/lib/auth'

const SignupPage = () => {
  const formMethods = useForm<SignupAttributes>({ mode: 'onBlur' })
  const { isAuthenticated, signUp, logIn } = useAuth()
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

    if (response.message) {
      return toast(response.message)
    }

    if (response.error) {
      return toast.error(response.error)
    }

    toast.success('Check your inbox for a confirmation code', {
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
      <Metadata title="Signup" />

      <main className="rw-main">
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">Signup</h2>
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
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                        message:
                          'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
                      },
                    }}
                  />
                  <FieldError name="password" className="rw-field-error" />

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">
                      Sign Up
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>Already have an account?</span>{' '}
            <Link to={routes.login()} className="rw-link">
              Log in!
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

export default SignupPage
