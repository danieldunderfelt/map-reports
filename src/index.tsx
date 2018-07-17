import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { configure, toJS } from 'mobx'
import { createStore } from 'mobx-app'
import UIStore from './stores/UIStore'
import { Router } from 'pathricia'
import createHistory from 'history/createBrowserHistory'
import 'normalize.css'
import { typography } from './style/typography'
import { injectGlobal } from 'styled-components'
import MapStore from './stores/MapStore'
import ReportStore from './stores/ReportStore'
import color from './style/colors'

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

configure({
  computedRequiresReaction: true,
  enforceActions: true,
})

const router = Router('/', createHistory())
const mountNode = document.getElementById('app')

let state
let actions
let prevState = {}

function initStore(initialState = {}) {
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

function render() {
  const App = require('./App').default

  ReactDOM.render(
    <App state={state} actions={actions} router={router} />,
    mountNode
  )
}

initStore(prevState)
render()

declare const module: any

if (module.hot) {
  module.hot.accept(() => {
    initStore(prevState)
    render()
  })

  module.hot.dispose(() => {
    prevState = toJS(state)
  })
}
