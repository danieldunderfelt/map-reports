import { hot } from 'react-hot-loader'
import * as React from 'react'
import styled from 'styled-components'
import Route from './helpers/Route'
import { observer } from 'mobx-react'
import routes from './routes'
import ReportsPage from './views/ReportsPage'
import { AppBar } from '@material-ui/core'
import CreateReportPage from './views/CreateReportPage'
import Nav from './components/Nav'
import InspectDatasets from './views/InspectDatasets'
import client from './helpers/graphqlClient'
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'mobx-react'

const Root = styled.div`
  height: 100vh;
`

const Header = styled(AppBar)``

const AppViews = styled.div``

const App = observer(({ state, actions, router }) => (
  <ApolloProvider client={client}>
    <Provider state={state} actions={actions} router={router}>
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
    </Provider>
  </ApolloProvider>
))

export default hot(module)(App)
