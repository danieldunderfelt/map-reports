import { gql } from 'apollo-server'

const locationTypeDefs = gql`
  type Location {
    lat: Float!
    lon: Float!
  }

  input InputLocation {
    lat: String!
    lon: String!
  }
`

export default locationTypeDefs
