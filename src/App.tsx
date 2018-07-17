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
import UnconnectedStopsMap from './components/UnconnectedStopsMap'
import MissingRoadsMap from './components/MissingRoadsMap'
import InspectDatasets from './views/InspectDatasets'

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
      <Route path={routes.INSPECT_DATASETS} component={InspectDatasets} />
    </AppViews>
  </Root>
))

export default hot(module)(App)
