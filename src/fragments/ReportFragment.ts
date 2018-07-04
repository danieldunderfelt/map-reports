import gql from 'graphql-tag'

export const ReportFragment = gql`
  fragment ReportFields on Report {
    id
    title
    body
    reporter {
      id
      name
      type
    }
  }
`
