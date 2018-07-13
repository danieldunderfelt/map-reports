import * as React from 'react'
import styled from 'styled-components'
import SubmitReport from './views/SubmitReport'
import Route from './helpers/Route'
import { inject, observer } from 'mobx-react'
import routes from './routes'
import ReportsPage from './views/ReportsPage'
import { AppBar, Tabs, Tab} from '@material-ui/core'

const Root = styled.div`
  height: 100vh;
`

const Header = styled(AppBar)``

const AppViews = styled.div``

const App = inject('router')(observer(({ router }) => (
  <Root>
    <Header position="static">
      <Tabs value={router.get()} onChange={(e, route) => router.go(route)}>
        <Tab value={routes.REPORTS} label="Dashboard" />
        <Tab value={routes.CREATE_REPORT} label="Create report" />
      </Tabs>
    </Header>
    <AppViews>
      <Route
        path={routes.REPORTS}
        component={ReportsPage}
      />
      <Route path={routes.CREATE_REPORT} component={SubmitReport} />
    </AppViews>
  </Root>
)))

export default App
