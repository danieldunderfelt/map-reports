const { ApolloServer, gql } = require('apollo-server')

const reporters = [
  {
    id: '123',
    name: 'anonuser',
    type: 'manual'
  },
  {
    id: '456',
    name: 'osm_kyttä',
    type: 'automatic'
  }
]

const reports = [
  {
    title: 'Pysäkki huonosti',
    body: 'Pysäkki H0333 on väärässä paikassa.',
    reporter: '123'
  },
  {
    title: 'crossing missing',
    body: 'Crossing missing at xxx.xxx.',
    reporter: '456'
  },
]

const typeDefs = gql`
  type Report {
    title: String
    body: String
    reporter: Reporter
  }
  
  type Reporter {
    id: ID
    name: String
    type: String
  }

  type Query {
    reports: [Report]
  }
`

const resolvers = {
  Query: {
    reports: () => reports,
  },
  Report: {
    reporter: (report) => reporters.find(rep => rep.id === report.reporter)
  }
}

const server = new ApolloServer({ typeDefs, resolvers, introspection: true })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
