import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { AnyFunction } from '../../types/AnyFunction'
import styled from 'styled-components'

type Props = {
  className?: string
  router?: {
    go: AnyFunction
  }
}

const Menu = styled.nav``

@inject('router')
@observer
class Nav extends React.Component<Props, any> {
  goTo = route => e => {
    e.preventDefault()
    const { router } = this.props
    router.go(route)
  }

  render() {
    const { className } = this.props

    return (
      <Menu className={className}>
        <a onClick={this.goTo('/')} href="/">
          Dashboard
        </a>{' '}
        <a onClick={this.goTo('/create-report')} href="/create-report">
          Create report
        </a>
      </Menu>
    )
  }
}

export default Nav
