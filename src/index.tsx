import * as React from 'react'
import * as ReactDOM from 'react-dom'
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
import color from './style/colors'

configure({
  computedRequiresReaction: true,
  enforceActions: true,
})

const mountNode = document.getElementById('app')

injectGlobal`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  ${color}
  ${typography}
`

const router = Router('/', createHistory())
let state
let actions

function createState(initialState = {}) {
  const stores = createStore(
    {
      UI: UIStore(router),
      Report: ReportStore,
      Map: MapStore,
    },
    initialState
  )

  state = stores.state
  actions = stores.actions
}

createState()

function render() {
  const app = (
    <ApolloProvider client={client}>
      <Provider state={state} actions={actions} router={router}>
        <App />
      </Provider>
    </ApolloProvider>
  )

  ReactDOM.render(app, mountNode)
}

render()

if (module.hot) {
  module.hot.accept(function() {
    createState(state)
    render()
  })
}
