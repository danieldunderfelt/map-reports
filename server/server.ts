import { CreateReportData } from '../types/CreateReportData'
import { createReport } from './createReport'
import { Report, ReportPriority, ReportStatus } from '../types/Report'
import { ReporterMeta } from '../types/Reporter'
import UnconnectedStopsReporter from './reporters/UnconnectedStopsReporter'

const { ApolloServer, gql } = require('apollo-server')

const helsinkiLocation = {
  latitude: 60.192059,
  longitude: 24.945831,
}

const reports: Report[] = []

function publishReport(report) {
  reports.push(report)
}

// Create reporter for unconnected stops
const stopsReporter = UnconnectedStopsReporter(
  {
    id: 'reporter_1',
    type: 'automatic',
  },
  publishReport,
)

const reporters: ReporterMeta[] = [
  {
    id: 'reporter_0',
    name: 'anonuser',
    type: 'manual',
  },
  stopsReporter.meta,
]

// Fetch unconnected stops and create reports.
stopsReporter.run()

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
    lat: Float!
    lon: Float!
  }

  type ReportItem {
    location: Location!
    type: String!
  }

  input CreateReportItem {
    location: CreateReportLocation!
    type: String!
  }

  type StopReportItem {
    location: Location!
    type: String!
    stopCode: String!
  }

  input CreateReportLocation {
    lat: String!
    lon: String!
  }

  union ReportItemType = StopReportItem | ReportItem

  type Report {
    id: ID!
    title: String!
    message: String
    reporter: Reporter!
    status: ReportStatus!
    priority: ReportPriority!
    item: ReportItemType!
    createdAt: Int!
    updatedAt: Int!
  }

  input CreateReport {
    title: String!
    message: String
    reporter: String!
    item: CreateReportItem!
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
      const report = createReport(reportData)
      publishReport(report)

      return report
    },
    setStatus: (
      _,
      { reportId, newStatus }: { reportId: string; newStatus: ReportStatus },
    ): Report => {
      const report = reports.find(r => r.id === reportId)

      if (!report) {
        throw new Error(`Report with ID ${reportId} not found.`)
      }

      report.status = newStatus
      return report
    },
    setPriority: (
      _,
      { reportId, newPriority }: { reportId: string; newPriority: ReportPriority },
    ): Report => {
      const report = reports.find(r => r.id === reportId)

      if (!report) {
        throw new Error(`Report with ID ${reportId} not found.`)
      }

      report.priority = newPriority
      return report
    },
  },
  ReportItemType: {
    __resolveType: obj => {
      if (obj.stopCode) {
        return 'StopReportItem'
      }

      return 'ReportItem'
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
