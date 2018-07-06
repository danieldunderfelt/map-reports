import * as React from 'react'
import { Router } from 'pathricia'
import { inject, observer} from 'mobx-react'
import { AnyFunction } from '../../types/AnyFunction'
import { observable, action} from 'mobx'

type Props = {
  component: any
  path: string
  router?: {
    listen: AnyFunction
    isActive: AnyFunction
  }
}

@inject('router')
@observer
class Route extends React.Component<Props, any> {
  unlisten = null
  @observable renderRoute = false

  componentWillMount() {
    this.onRouteChange()
  }

  componentDidMount() {
    const { router } = this.props
    this.unlisten = router.listen(this.onRouteChange)
  }

  componentWillUnmount() {
    this.unlisten()
  }

  routeShouldRender() {
    const { path, router } = this.props
    return router.isActive(path)
  }

  @action onRouteChange = () => {
    this.renderRoute = this.routeShouldRender()
  }

  render() {
    const { component: Component, ...rest } = this.props
    return this.renderRoute ? <Component {...rest} /> : null
  }
}

export default Route
