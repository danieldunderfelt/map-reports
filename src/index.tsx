import * as React from 'react'
import { render } from 'react-dom'
import { configure } from 'mobx'
import AppContainer from './AppContainer'

configure({
  computedRequiresReaction: true,
  enforceActions: true,
})

const mountNode = document.getElementById('app')

render(<AppContainer />, mountNode)
