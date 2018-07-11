import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { omit } from 'lodash'
import { computed } from 'mobx'

interface Props<P> {
  component: React.ComponentType<P & any>
  path: string
  state?: any
}

@inject('state')
@observer
class Route<ComponentProps> extends React.Component<
  ComponentProps & Props<ComponentProps>,
  any
> {
  @computed
  get routeShouldRender() {
    const { path, state } = this.props
    return state.route === path
  }

  render() {
    const { component } = this.props
    const componentProps = omit(this.props, 'component')

    return this.routeShouldRender
      ? React.createElement(component, componentProps)
      : null
  }
}

export default Route
