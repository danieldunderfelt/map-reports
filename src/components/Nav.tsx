import * as React from 'react'
import { inject, observer} from 'mobx-react'
import { AnyFunction } from '../../types/AnyFunction'

type Props = {
  router: {
    go: AnyFunction
  }
}

@inject('router')
@observer
class Nav extends React.Component<Props, any> {

  goTo = route => e => {
    e.preventDefault()
    const { router } = this.props
    router.go(route)
  }

  render() {

    return (
      <div>
        <a onClick={this.goTo('/')} href="/">Dashboard</a>{' '}
        <a onClick={this.goTo('/create-report')} href="/create-report">Create report</a>
      </div>
    )
  }
}

export default Nav
