import { gql } from 'apollo-server'

const rootTypeDefs = gql`
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
  }

  type Mutation {
    createReport(reportData: InputReport!, location: InputLocation!): Report
    setStatus(reportId: String!, newStatus: ReportStatus): Report
    setPriority(reportId: String!, newPriority: ReportPriority): Report
  }
`

export default rootTypeDefs
