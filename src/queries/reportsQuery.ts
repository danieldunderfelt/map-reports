import { ReportFragment } from '../fragments/ReportFragment'
import gql from 'graphql-tag'

export const reportsQuery = gql`
  {
    reports {
      ...ReportFields
    }
  }
  ${ReportFragment}
`
