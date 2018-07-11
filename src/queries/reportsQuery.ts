import { ReportFragment } from '../fragments/ReportFragment'
import gql from 'graphql-tag'

export const reportsQuery = gql`
  query reportsQuery(
    $perPage: Int
    $cursor: String
    $sort: SortParams
    $filter: [FilterParams]
  ) {
    reports(perPage: $perPage, cursor: $cursor, sort: $sort, filter: $filter) {
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        totalPages
      }
      edges {
        cursor
        node {
          ...ReportFields
        }
      }
    }
  }
  ${ReportFragment}
`
