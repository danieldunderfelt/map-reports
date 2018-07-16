import * as React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'
import Route from './helpers/Route'
import { inject, observer } from 'mobx-react'
import routes from './routes'
import ReportsPage from './views/ReportsPage'
import { AppBar, Tabs, Tab } from '@material-ui/core'
import CreateReportPage from './views/CreateReportPage'
import Nav from './components/Nav'
import UnconnectedStopsMap from './views/UnconnectedStopsMap'
import MissingRoadsMap from './views/MissingRoadsMap'

const Root = styled.div`
  height: 100vh;
`

const Header = styled(AppBar)``

const AppViews = styled.div``

const App = observer(() => (
  <Root>
    <Header position="static">
      <Nav />
    </Header>
    <AppViews>
      <Route path={routes.REPORTS} component={ReportsPage} />
      <Route path={routes.CREATE_REPORT} component={CreateReportPage} />
      <Route path={routes.UNCONNECTED_STOPS} component={UnconnectedStopsMap} />
      <Route path={routes.MISSING_ROADS} component={MissingRoadsMap} />
    </AppViews>
  </Root>
))

export default hot(module)(App)
