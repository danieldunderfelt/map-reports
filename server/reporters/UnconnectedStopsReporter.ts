import { DateTime } from 'luxon'
import got from 'got'
import neatCsv from 'neat-csv'
import { Reporter, ReporterConfig } from '../../types/Reporter'
import GeoJSON from 'geojson'

type UnconnectedStop = {
  stop_code: string
  jore_lat: string
  jore_lon: string
  departures: string
}

const UnconnectedStopsReporter = (
  reporterConfig: ReporterConfig,
  database: any
): Reporter => {
  const reporterMeta = {
    name: 'Unconnected stops reporter',
    type: 'automatic',
    dataset: 'unconnected_stops',
    ...reporterConfig,
  }

  database.table('reporter').add(reporterMeta)

  const csvUrl = 'http://api.digitransit.fi/routing-data/v2/hsl/unconnected.csv'
  const cron = '* 7 * * *' // at 7am every day
  let lastFetchedCsv = ''
  let lastFetchedAt: DateTime = null

  function schedule(scheduler) {
    return scheduler(cron, () => run())
  }

  async function run() {
    if (
      !lastFetchedCsv || // if there is not a fetched CSV
      (!!lastFetchedAt && lastFetchedAt < DateTime.local().minus({ days: 1 })) // ...that is newer than one day...
    ) {
      // Fetch a new CSV of unconnected stops.
      const csvRequest = await got(csvUrl)
      lastFetchedCsv = csvRequest.body
      lastFetchedAt = DateTime.local()
    }

    const unconnectedStopsData: UnconnectedStop[] = await neatCsv(lastFetchedCsv)

    // @ts-ignore
    const stopsGeoJSON = GeoJSON.parse(unconnectedStopsData, {
      Point: ['jore_lat', 'jore_lon'],
      include: ['stop_code'],
    })

    const datasetsTable = database.table('datasets')

    datasetsTable.updateOrAdd(reporterMeta.dataset, {
      id: reporterMeta.dataset,
      label: 'Unconnected stops',
      geoJSON: JSON.stringify(stopsGeoJSON),
    })
  }

  return {
    meta: reporterMeta,
    run,
    schedule,
  }
}

export default UnconnectedStopsReporter
