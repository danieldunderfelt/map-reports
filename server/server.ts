import database from './database'
import UnconnectedStopsReporter from './reporters/UnconnectedStopsReporter'
import createServer from './graphql/schema'

/**
 * Set up database
 */

const db = database()
const reportsTable = db.table('report')

/**
 * Set up reporters
 */

// Create reporter for unconnected stops
const stopsReporter = UnconnectedStopsReporter(
  {
    id: 'reporter_1',
    type: 'automatic',
  },
  reportsTable.add,
)

db.table('reporter').add(stopsReporter.meta)

/**
 * Run reporters
 */

stopsReporter.run()

/**
 * Start server
 */

const server = createServer(db)

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
