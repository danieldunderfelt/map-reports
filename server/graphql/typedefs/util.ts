import { gql } from 'apollo-server'

const utilTypeDefs = gql`  
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
`

export default utilTypeDefs
