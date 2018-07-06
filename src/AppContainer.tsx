import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'mobx-react'
import { Router } from 'pathricia'
import createHistory from 'history/createBrowserHistory'
import client from './helpers/graphqlClient'
import App from './views/App'
import 'normalize.css'
import { injectGlobal } from 'styled-components'
import { typography } from './style/typography'

injectGlobal`
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  ${typography}
`

const router = Router('/', createHistory())

const AppContainer = () => (
  <ApolloProvider client={client}>
    <Provider router={router}>
      <App />
    </Provider>
  </ApolloProvider>
)

export default AppContainer
