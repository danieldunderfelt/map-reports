import * as React from 'react'
import { render } from 'react-dom'
import { configure } from 'mobx'
import client from './helpers/graphqlClient'
import { createStore } from 'mobx-app'
import UIStore from './stores/UIStore'
import { Router } from 'pathricia'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'mobx-react'
import createHistory from 'history/createBrowserHistory'
import App from './App'
import 'normalize.css'
import { typography } from './style/typography'
import { injectGlobal } from 'styled-components'
import MapStore from './stores/MapStore'
import ReportStore from './stores/ReportStore'

configure({
  computedRequiresReaction: true,
  enforceActions: true,
})

const mountNode = document.getElementById('app')

injectGlobal`
  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  ${typography}
`

const router = Router('/', createHistory())

const { state, actions } = createStore(
  {
    UI: UIStore,
    Report: ReportStore,
    Map: MapStore,
  },
  {
    router,
    client
  },
)

const app = (
  <ApolloProvider client={client}>
    <Provider state={state} actions={actions} router={router}>
      <App />
    </Provider>
  </ApolloProvider>
)

render(app, mountNode)
