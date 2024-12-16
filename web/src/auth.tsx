import { PropsWithChildren, useEffect } from 'react'

import { createAuth, createDbAuthClient } from '@redwoodjs/auth-dbauth-web'

import { listenAuthBroadcast } from './lib/broadcast'

const dbAuthClient = createDbAuthClient()

export const { AuthProvider: BaseAuthProvider, useAuth } =
  createAuth(dbAuthClient)

export const useAuthBroadcast = () => {
  const { isAuthenticated, reauthenticate } = useAuth()

  useEffect(() => {
    const actions = listenAuthBroadcast((newIsAuthenticated) => {
      if (newIsAuthenticated === isAuthenticated) return
      reauthenticate()
    })
    if (!actions) return

    actions.sendEvent(isAuthenticated)
    return () => actions.clean()
  }, [isAuthenticated, reauthenticate])
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const Children = () => {
    useAuthBroadcast()
    return <>{children}</>
  }

  return (
    <BaseAuthProvider>
      <Children />
    </BaseAuthProvider>
  )
}
