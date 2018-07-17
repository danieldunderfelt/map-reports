import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Tabs, Tab } from '@material-ui/core'
import routes from '../routes'
import { compose } from 'react-apollo'

const enhance = compose(
  inject('state', 'router'),
  observer
)

const Nav = enhance(({ state, router }) => {

  return (
    <Tabs value={state.route} onChange={(e, route) => router.go(route)}>
      <Tab value={routes.REPORTS} label="Dashboard" />
      <Tab value={routes.CREATE_REPORT} label="Create report" />
      <Tab value={routes.INSPECT_DATASETS} label="Inspect datasets" />
    </Tabs>
  )
})

export default Nav
