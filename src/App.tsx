import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import ApolloClient from 'apollo-boost'
import Dashboard from './views/Dashboard'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
})

const App = () => (
  <ApolloProvider client={client}>
    <Dashboard />
  </ApolloProvider>
)

export default App
