import { gql } from 'apollo-server'

const reportTypeDefs = gql`
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

  type ReportItem {
    type: String!
    location: Location!
    recommendedMapZoom: Int
    feature: String
  }

  type StopReportItem {
    type: String!
    location: Location!
    stopCode: String!
    recommendedMapZoom: Int
  }

  input InputReportItem {
    type: String!
    location: InputLocation!
    recommendedMapZoom: Int
    stopCode: String
    feature: String
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

  input InputReport {
    title: String!
    message: String
  }

  type ReportsEdge {
    cursor: String
    node: Report
  }

  type ReportsConnection {
    pageInfo: PageInfo
    edges: [ReportsEdge]
  }

  type ReportFilterOptions {
    key: String!
    options: [String]!
  }
`

export default reportTypeDefs
