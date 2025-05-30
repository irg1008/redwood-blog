import type { APIGatewayProxyEvent, Handler } from 'aws-lambda'
import { passwordSchema, v } from 'schemas'

import type { DbAuthHandlerOptions, UserType } from '@redwoodjs/auth-dbauth-api'
import { DbAuthHandler } from '@redwoodjs/auth-dbauth-api'

import { getLanguageContext } from 'src/i18n/i18n'
import { cookieName } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { sendConfirmCode, sendResetPassword } from 'src/services/users'

import type { TranslatePath } from '$web/src/i18n/i18n'

export const handler: Handler<APIGatewayProxyEvent> = async (
  event,
  requestContext
) => {
  const forgotPasswordOptions: DbAuthHandlerOptions['forgotPassword'] = {
    // handler() is invoked after verifying that a user was found with the given
    // username. This is where you can send the user an email with a link to
    // reset their password. With the default dbAuth routes and field names, the
    // URL to reset the password will be:
    //
    // https://example.com/reset-password?resetToken=${user.resetToken}
    //
    // Whatever is returned from this function will be returned from
    // the `forgotPassword()` function that is destructured from `useAuth()`.
    // You could use this return value to, for example, show the email
    // address in a toast message so the user will know it worked and where
    // to look for the email.
    //
    // Note that this return value is sent to the client in *plain text*
    // so don't include anything you wouldn't want prying eyes to see. The
    // `user` here has been sanitized to only include the fields listed in
    // `allowedUserFields` so it should be safe to return as-is.
    handler: async (user, resetToken) => {
      const context = getLanguageContext(event, requestContext)
      await sendResetPassword({ email: user.email, resetToken }, { context })
      return user
    },

    // How long the resetToken is valid for, in seconds (default is 24 hours)
    expires: 60 * 60 * 24,

    errors: {
      // for security reasons you may want to be vague here rather than expose
      // the fact that the email address wasn't found (prevents fishing for
      // valid email addresses)
      usernameNotFound:
        'ForgotPassword.errors.username.not-found' satisfies TranslatePath,
      // if the user somehow gets around client validation
      usernameRequired:
        'ForgotPassword.errors.username.required' satisfies TranslatePath,
    },
  }

  const loginOptions: DbAuthHandlerOptions['login'] = {
    // handler() is called after finding the user that matches the
    // username/password provided at login, but before actually considering them
    // logged in. The `user` argument will be the user in the database that
    // matched the username/password.
    //
    // If you want to allow this user to log in simply return the user.
    //
    // If you want to prevent someone logging in for another reason (maybe they
    // didn't validate their email yet), throw an error and it will be returned
    // by the `logIn()` function from `useAuth()` in the form of:
    // `{ message: 'Error message' }`
    handler: async (user) => {
      if (user.confirmed) return user
      await sendConfirmCode({ email: user.email })
      const msg: TranslatePath = 'Login.actions.confirm-user'
      throw new Error(msg)
    },

    errors: {
      usernameOrPasswordMissing:
        'Login.errors.fields-required' satisfies TranslatePath,
      usernameNotFound:
        'Login.errors.username.not-found' satisfies TranslatePath,
      // For security reasons you may want to make this the same as the
      // usernameNotFound error so that a malicious user can't use the error
      // to narrow down if it's the username or password that's incorrect
      incorrectPassword:
        'Login.errors.password.incorrect' satisfies TranslatePath,
    },

    // How long a user will remain logged in, in seconds
    expires: 60 * 60 * 24 * 365,
  }

  const resetPasswordOptions: DbAuthHandlerOptions['resetPassword'] = {
    // handler() is invoked after the password has been successfully updated in
    // the database. Returning anything truthy will automatically log the user
    // in. Return `false` otherwise, and in the Reset Password page redirect the
    // user to the login page.
    handler: async (user) => {
      await db.user.update({
        where: { id: user.id },
        data: {
          confirmed: true,
          confirmToken: null,
          confirmTokenExpiresAt: null,
        },
      })

      return true
    },

    // If `false` then the new password MUST be different from the current one
    allowReusedPassword: true,

    errors: {
      // the resetToken is valid, but expired
      resetTokenExpired:
        'ResetPassword.errors.reset-token.expired' satisfies TranslatePath,
      // no user was found with the given resetToken
      resetTokenInvalid:
        'ResetPassword.errors.reset-token.invalid' satisfies TranslatePath,
      // the resetToken was not present in the URL
      resetTokenRequired:
        'ResetPassword.errors.reset-token.required' satisfies TranslatePath,
      // new password is the same as the old password (apparently they did not forget it)
      reusedPassword:
        'ResetPassword.errors.password.already-used' satisfies TranslatePath,
    },
  }

  interface UserAttributes {
    name: string
  }

  const signupOptions: DbAuthHandlerOptions<
    UserType,
    UserAttributes
  >['signup'] = {
    // Whatever you want to happen to your data on new user signup. Redwood will
    // check for duplicate usernames before calling this handler. At a minimum
    // you need to save the `username`, `hashedPassword` and `salt` to your
    // user table. `userAttributes` contains any additional object members that
    // were included in the object given to the `signUp()` function you got
    // from `useAuth()`.
    //
    // If you want the user to be immediately logged in, return the user that
    // was created.
    //
    // If this handler throws an error, it will be returned by the `signUp()`
    // function in the form of: `{ error: 'Error message' }`.
    //
    // If this returns anything else, it will be returned by the
    // `signUp()` function in the form of: `{ message: 'String here' }`.
    handler: async ({ username, hashedPassword, salt, userAttributes }) => {
      const user = await db.user.create({
        data: {
          email: username,
          hashedPassword: hashedPassword,
          salt: salt,
          name: userAttributes?.name,
        },
      })

      await sendConfirmCode({ email: user.email })
    },

    // Include any format checks for password here. Return `true` if the
    // password is valid, otherwise throw a `PasswordValidationError`.
    // Import the error along with `DbAuthHandler` from `@redwoodjs/api` above.
    passwordValidation: (password) => {
      v.parse(passwordSchema, password)
      return true
    },

    errors: {
      // `field` will be either "username" or "password"
      fieldMissing: 'Signup.errors.fields-required' satisfies TranslatePath,
      usernameTaken: 'Signup.errors.username.taken' satisfies TranslatePath,
    },
  }

  const authHandler = new DbAuthHandler(event, requestContext, {
    // Provide prisma db client
    db: db,

    // The name of the property you'd call on `db` to access your user table.
    // i.e. if your Prisma model is named `User` this value would be `user`, as in `db.user`
    authModelAccessor: 'user',

    // A map of what dbAuth calls a field to what your database calls it.
    // `id` is whatever column you use to uniquely identify a user (probably
    // something like `id` or `userId` or even `email`)
    authFields: {
      id: 'id',
      username: 'email',
      hashedPassword: 'hashedPassword',
      salt: 'salt',
      resetToken: 'resetToken',
      resetTokenExpiresAt: 'resetTokenExpiresAt',
    },

    // A list of fields on your user object that are safe to return to the
    // client when invoking a handler that returns a user (like forgotPassword
    // and signup). This list should be as small as possible to be sure not to
    // leak any sensitive information to the client.
    allowedUserFields: ['id', 'email'],

    // Specifies attributes on the cookie that dbAuth sets in order to remember
    // who is logged in. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies
    cookie: {
      attributes: {
        HttpOnly: true,
        Path: '/',
        SameSite: 'Strict',
        Secure: process.env.NODE_ENV !== 'development',

        // If you need to allow other domains (besides the api side) access to
        // the dbAuth session cookie:
        // Domain: 'example.com',
      },
      name: cookieName,
    },

    forgotPassword: forgotPasswordOptions,
    login: loginOptions,
    resetPassword: resetPasswordOptions,
    signup: signupOptions,
  })

  return await authHandler.invoke()
}
