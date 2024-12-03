import { NextUIProvider } from '@nextui-org/react'

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web'
import {
  GraphQLClientConfigProp,
  RedwoodApolloProvider,
} from '@redwoodjs/web/apollo'

import possibleTypes from 'src/graphql/possibleTypes'
import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'

import { i18nInit } from './i18n/i18n'
import { AuthProvider, useAuth } from './lib/auth'

import './index.css'
import './scaffold.css'

i18nInit()

const graphQLClientConfig: GraphQLClientConfigProp = {
  cacheConfig: {
    possibleTypes: possibleTypes.possibleTypes,
  },
}

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider>
        <RedwoodApolloProvider
          useAuth={useAuth}
          graphQLClientConfig={graphQLClientConfig}
        >
          <NextUIProvider>
            <Routes />
          </NextUIProvider>
        </RedwoodApolloProvider>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
)

export default App
