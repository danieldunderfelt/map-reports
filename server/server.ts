import { CreateReportData } from '../types/CreateReportData'
import { createReport } from './createReport'
import { orderBy, get, toLower, groupBy, values } from 'lodash'
import {
  Report,
  ReportPriority as ReportPriorityEnum,
  ReportPriority,
  ReportStatus as ReportStatusEnum,
  ReportStatus,
} from '../types/Report'
import { ReporterMeta } from '../types/Reporter'
import UnconnectedStopsReporter from './reporters/UnconnectedStopsReporter'
import fuzzysearch from 'fuzzysearch'

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

  input CreateReportLocation {
    lat: String!
    lon: String!
  }

  type ReportItem {
    location: Location!
    type: String!
    recommendedMapZoom: Int
  }

  input CreateReportItem {
    location: CreateReportLocation!
    type: String!
    recommendedMapZoom: Int
  }

  type StopReportItem {
    location: Location!
    type: String!
    stopCode: String!
    recommendedMapZoom: Int
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

  enum SortDirection {
    asc
    desc
  }

  input SortParams {
    key: String!
    direction: SortDirection!
  }

  input FilterParams {
    key: String!
    value: String!
  }

  type PageInfo {
    currentPage: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    totalPages: Int!
  }

  type ReportsEdge {
    cursor: String
    node: Report
  }

  type ReportsConnection {
    pageInfo: PageInfo
    edges: [ReportsEdge]
  }

  type Query {
    reports(
      perPage: Int = 10
      cursor: String
      sort: SortParams
      filter: [FilterParams]
    ): ReportsConnection
  }

  type Mutation {
    createReport(reportData: CreateReport): Report
    setStatus(reportId: String!, newStatus: ReportStatus): Report
    setPriority(reportId: String!, newPriority: ReportPriority): Report
  }
`

const sortValues = {
  reporter: obj => (obj.reporter.type === 'manual' ? 1 : 0),
  status: obj => Object.values(ReportStatusEnum).indexOf(obj.status),
  priority: obj => Object.values(ReportPriorityEnum).indexOf(obj.priority),
}

function getCursor(node, params) {
  return Buffer.from(JSON.stringify({ id: node.id, ...params })).toString('base64')
}

const resolvers = {
  Query: {
    reports: (_, { perPage = 10, cursor = '', sort, filter }) => {
      // Group filters by the key they use
      const filterGroups = values(groupBy(filter.filter(f => !!f.key), 'key'))

      // Include only reports that match all filters
      const filteredReports = reports.filter(report =>
        // make sure that the current report matches every filter group
        filterGroups.every(filterGroup =>
          // Filters are grouped by key. If there are many keys, treat it as an
          // "or" filter such that the report[key] value matches either filter.
          // A single filter in a group is effectively an "and" filter.
          filterGroup.some(filter =>
            // Use fuzzy search to match the filter value and the report[key] value.
            fuzzysearch(toLower(filter.value), toLower(get(report, filter.key, ''))),
          ),
        ),
      )

      // Order the filtered reports
      const filteredAndSorted = orderBy<Report>(
        filteredReports,
        value => {
          const getSortValue = get(sortValues, sort.key, obj => obj[sort.key])
          return getSortValue(value)
        },
        sort.direction,
      )

      const reportEdges = filteredAndSorted.map(report => ({
        node: report,
        cursor: getCursor(report, { sort, filter })
      }))

      const sliceStart = reportEdges.findIndex(edge => edge.cursor === cursor) + 1
      const sliceEnd = sliceStart + perPage
      const totalItems = filteredAndSorted.length
      const totalPages = Math.ceil(perPage / totalItems)

      return {
        edges: reportEdges.slice(sliceStart, sliceEnd),
        pageInfo: {
          currentPage: 1,
          hasNextPage: sliceEnd < totalItems,
          hasPreviousPage: sliceEnd > perPage,
          totalPages
        }
      }
    },
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
