import { ApolloServer, gql } from 'apollo-server'

// Typedefs
import root from './typedefs/root'
import util from './typedefs/util'
import location from './typedefs/location'
import reporter from './typedefs/reporter'
import report from './typedefs/report'

// Resolvers
import createResolvers from './resolvers/resolvers'

const typeDefs = [root, util, location, reporter, report]

function createServer(db) {
  return new ApolloServer({
    typeDefs,
    resolvers: createResolvers(db)
  })
}

export default createServer
