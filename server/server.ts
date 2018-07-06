import { CreateReportData } from '../types/CreateReportData'
import { createReport } from './createReport'
import { Report, ReportPriority, ReportStatus } from '../types/Report'
import { Reporter } from '../types/Reporter'

const { ApolloServer, gql } = require('apollo-server')

const reporters: Reporter[] = [
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

const reports: Report[] = [
  createReport(
    {
      title: 'Pysäkki huonosti',
      message: 'Pysäkki H0333 on väärässä paikassa.',
      reporter: 'reporter_0',
    },
    0,
  ),
  createReport(
    {
      title: 'crossing missing',
      message: 'Crossing missing at xxx.xxx.',
      reporter: 'reporter_1',
    },
    1,
  ),
  createReport(
    {
      title: 'linja menee väärin kartalla',
      message: 'Bussi ei ajanut kartan mukaan. Onko linja oikein?',
      reporter: 'reporter_0',
    },
    2,
  ),
  createReport(
    {
      title: 'stop not connected',
      message: 'Unconnected stop at xxx.xxx.',
      reporter: 'reporter_1',
    },
    3,
  ),
  createReport(
    {
      title: 'stop not by road',
      message: 'A stop is not by a road at xxx.xxx.',
      reporter: 'reporter_1',
    },
    4,
  ),
]

const typeDefs = gql`
  enum ReportStatus {
    NEW
    ACCEPTED
    WIP
    DONE
    REJECTED
  }

  enum ReportPriority {
    LOW
    HIGH
    CRITICAL
  }

  type Location {
    lat: String!
    lon: String!
  }
  
  input CreateReportLocation {
    lat: String!
    lon: String!
  }

  type Report {
    id: ID!
    title: String!
    message: String
    reporter: Reporter!
    status: ReportStatus!
    priority: ReportPriority!
    location: Location
    createdAt: Int!
    updatedAt: Int!
  }
  
  input CreateReport {
    title: String!
    message: String
    reporter: String!
    location: CreateReportLocation
    priority: ReportPriority
  }

  type Reporter {
    id: ID!
    name: String!
    type: String!
  }

  type Query {
    reports: [Report]
  }

  type Mutation {
    createReport(reportData: CreateReport): Report
    setStatus(reportId: String!, newStatus: ReportStatus): Report
    setPriority(reportId: String!, newPriority: ReportPriority): Report
  }
`

const resolvers = {
  Query: {
    reports: () => reports,
  },
  Mutation: {
    createReport: (_, { reportData }: { reportData: CreateReportData }): Report => {
      const index = reports.length
      const report = createReport(reportData, index)

      reports.push(report)
      return report
    },
    setStatus: (_, { reportId, newStatus }: { reportId: string, newStatus: ReportStatus }): Report => {
      const report = reports.find(r => r.id === reportId)

      if(!report) {
        throw new Error(`Report with ID ${reportId} not found.`)
      }

      report.status = newStatus
      return report
    },
    setPriority: (_, { reportId, newPriority }: { reportId: string, newPriority: ReportPriority }): Report => {
      const report = reports.find(r => r.id === reportId)

      if (!report) {
        throw new Error(`Report with ID ${reportId} not found.`)
      }

      report.priority = newPriority
      return report
    },
  },
  Report: {
    reporter: report =>
      reporters.find(rep => rep.id === report.reporter) || 'NO REPORTER',
  },
}

const server = new ApolloServer({ typeDefs, resolvers, introspection: true })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
