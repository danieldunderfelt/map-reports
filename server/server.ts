import { CreateReportData } from '../types/CreateReportData'
import { createReport } from './createReport'
import { Report, ReportPriority, ReportStatus } from '../types/Report'
import { Reporter } from '../types/Reporter'
import { generateRandomPoint } from 'generate-random-points'
import faker from 'faker'

const { ApolloServer, gql } = require('apollo-server')

const helsinkiLocation = {
  latitude: 60.192059,
  longitude: 24.945831
}

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

const reports: Report[] = []

for (let i = 0; i < 10; i++) {
  const loc = generateRandomPoint(helsinkiLocation, 5000)

  const rep = createReport(
    {
      title: 'Pysäkki huonosti',
      message: 'Pysäkki H0333 on väärässä paikassa.',
      reporter: reporters[Math.round(Math.random())].id,
      location: { lat: loc.latitude, lon: loc.longitude },
    },
    i,
  )

  reports.push(rep)
}

console.log(reports)

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
  Report: {
    reporter: report =>
      reporters.find(rep => rep.id === report.reporter) || 'NO REPORTER',
  },
}

const server = new ApolloServer({ typeDefs, resolvers, introspection: true })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
