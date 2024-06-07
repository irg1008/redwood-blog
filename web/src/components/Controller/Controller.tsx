import { ComponentProps } from 'react'

export { ApolloError } from '@apollo/client'

import { Controller as RHFController, useErrorStyles } from '@redwoodjs/forms'

const Controller = (props: ComponentProps<typeof RHFController>) => {
  // Calling this hooks adds server-side error styles to form context
  // This should probably be default behaviour in Redwood.
  // 1. A custom controller should exist
  // 2. A less verbose hook should be available (no style, just error handling) like useError(name)
  useErrorStyles({ name: props.name })
  return <RHFController {...props} />
}

export default Controller
