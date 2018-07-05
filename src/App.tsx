import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import Dashboard from './views/Dashboard'
import { Provider } from 'mobx-react'
import { Router } from 'pathricia'
import createHistory from 'history/createBrowserHistory'
import Route from './helpers/Route'
import Nav from './components/Nav'
import CreateReport from './views/createReport'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
})

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
