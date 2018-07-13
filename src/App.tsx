import * as React from 'react'
import styled from 'styled-components'
import SubmitReport from './views/SubmitReport'
import Nav from './components/Nav'
import Route from './helpers/Route'
import { observer } from 'mobx-react'
import routes from './routes'
import ReportsPage from './views/ReportsPage'

const Root = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 4rem 1fr;
`

const Header = styled.header``

const AppViews = styled.div``

const App = observer(() => (
  <Root>
    <Header>
      <Nav />
    </Header>
    <AppViews>
      <Route
        path={routes.REPORTS}
        component={ReportsPage}
      />
      <Route path={routes.CREATE_REPORT} component={SubmitReport} />
    </AppViews>
  </Root>
))

export default App
