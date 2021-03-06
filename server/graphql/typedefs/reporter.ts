import { gql } from 'apollo-server'

const reporterTypeDefs = gql`
  type Reporter {
    id: ID!
    name: String!
    type: String!
    dataset: String
  }
`

export default reporterTypeDefs
