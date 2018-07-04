const { ApolloServer, gql } = require('apollo-server')

const reporters = [
  {
    id: 'reporter_0',
    name: 'anonuser',
    type: 'manual',
  },
  {
    id: 'reporter_1',
    name: 'osm_kyttä',
    type: 'automatic',
  },
]

const reports = [
  {
    id: 'report_0',
    title: 'Pysäkki huonosti',
    body: 'Pysäkki H0333 on väärässä paikassa.',
    reporter: 'reporter_0',
  },
  {
    id: 'report_1',
    title: 'crossing missing',
    body: 'Crossing missing at xxx.xxx.',
    reporter: 'reporter_1',
  },
]

const typeDefs = gql`
  type Report {
    id: ID
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

  type Mutation {
    createReport(title: String, body: String): Report
  }
`

const resolvers = {
  Query: {
    reports: () => reports,
  },
  Mutation: {
    createReport: (_, { title, body }) => {
      const index = reports.length

      const report = {
        id: `report_${index}`,
        title,
        body,
        reporter: 'reporter_0',
      }

      reports.push(report)
      return report
    },
  },
  Report: {
    reporter: report => reporters.find(rep => rep.id === report.reporter),
  },
}

const server = new ApolloServer({ typeDefs, resolvers, introspection: true })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
