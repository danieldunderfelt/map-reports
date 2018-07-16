import database from './database'
import UnconnectedStopsReporter from './reporters/UnconnectedStopsReporter'
import createServer from './graphql/schema'
import MissingRoadsReporter from './reporters/MissingRoadsReporter'

/**
 * Set up database
 */

const db = database()

/**
 * Set up reporters
 */

// Create reporter for unconnected stops
const stopsReporter = UnconnectedStopsReporter(
  {
    id: 'reporter_1',
    type: 'automatic',
  },
  db
)

const missingRoadsReporter = MissingRoadsReporter(
  {
    id: 'reporter_2',
    type: 'automatic',
  },
  db
)

/**
 * Run reporters
 */

stopsReporter.run()
missingRoadsReporter.run()

/**
 * Start server
 */

const server = createServer(db)

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
