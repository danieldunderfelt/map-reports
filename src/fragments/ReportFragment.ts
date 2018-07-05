import gql from 'graphql-tag'

export const ReportFragment = gql`
  fragment ReportFields on Report {
    id
    title
    message
    status
    priority
    location {
      lat
      lon
    }
    createdAt
    updatedAt
    reporter {
      id
      name
      type
    }
  }
`
