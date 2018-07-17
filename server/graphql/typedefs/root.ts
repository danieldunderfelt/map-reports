import { gql } from 'apollo-server'

const rootTypeDefs = gql`
  type Dataset {
    id: String!
    geoJSON: String!
    label: String!
  }

  type Query {
    reports: [Report]
    reportFilterOptions: [ReportFilterOptions]
    reportsConnection(
      perPage: Int = 10
      cursor: String
      sort: SortParams
      filter: [FilterParams]
    ): ReportsConnection
    reporters: [Reporter]
    datasets: [Dataset]
    dataset(id: String!): Dataset
  }

  type Mutation {
    createReport(
      reportData: InputReport!
      reportItem: InputReportItem
    ): Report
    removeReport(reportId: String!): Boolean
    setStatus(reportId: String!, newStatus: ReportStatus): Report
    setPriority(reportId: String!, newPriority: ReportPriority): Report
  }
`

export default rootTypeDefs
