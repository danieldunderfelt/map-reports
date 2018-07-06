import * as React from 'react'
import { render } from 'react-dom'
import { configure } from 'mobx'
import App from './App'

configure({
  computedRequiresReaction: true,
  enforceActions: true,
})

const mountNode = document.getElementById('app')

render(<App />, mountNode)
