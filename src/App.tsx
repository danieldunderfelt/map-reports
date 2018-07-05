import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import Dashboard from './views/Dashboard'
import { Provider } from 'mobx-react'
import { Router } from 'pathricia'
import createHistory from 'history/createBrowserHistory'
import Route from './helpers/Route'
import Nav from './components/Nav'
import CreateReport from './views/createReport'
import client from './helpers/graphqlClient'

const router = Router('/', createHistory())

const App = () => (
  <ApolloProvider client={client}>
    <Provider router={router}>
      <>
        <Nav />
        <Route path="/" component={Dashboard} />
        <Route path="/create-report" component={CreateReport} />
      </>
    </Provider>
  </ApolloProvider>
)

export default App
