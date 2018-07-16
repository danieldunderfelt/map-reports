import gql from 'graphql-tag'

export const ReportFragment = gql`
  fragment ReportFields on Report {
    id
    title
    message
    status
    priority
    item {
      ... on StopReportItem {
        stopCode
        type
        recommendedMapZoom
        location {
          lat
          lon
        }
      }
      ... on ReportItem {
        type
        recommendedMapZoom
        feature
        location {
          lat
          lon
        }
      }
    }
    createdAt
    updatedAt
    reporter {
      id
      name
      type
      __typename
    }
    __typename
  }
`
