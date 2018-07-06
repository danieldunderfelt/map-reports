import * as React from 'react'
import { Router } from 'pathricia'
import { inject, observer} from 'mobx-react'
import { AnyFunction } from '../../types/AnyFunction'
import { observable, action} from 'mobx'
import { omit } from 'lodash'

interface Props<P> {
  component: React.ComponentType<P & any>
  path: string
  router?: {
    listen: AnyFunction
    isActive: AnyFunction
  }
}

@inject('router')
@observer
class Route<ComponentProps> extends React.Component<ComponentProps & Props<ComponentProps>, any> {
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
    const { component } = this.props
    const componentProps = omit(this.props, 'component')

    return this.renderRoute ? React.createElement(component, componentProps) : null
  }
}

export default Route
