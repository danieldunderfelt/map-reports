import { DateTime } from 'luxon'
import got from 'got'
import neatCsv from 'neat-csv'
import StopReport from '../reports/StopReport'
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

    const stopsGeoJSON = GeoJSON.parse(unconnectedStopsData, {
      Point: ['jore_lat', 'jore_lon'],
      include: ['stop_code'],
    })

    const datasetsTable = database.table('datasets')

    datasetsTable.updateOrAdd(reporterMeta.dataset, {
      id: reporterMeta.dataset,
      geoJSON: JSON.stringify(stopsGeoJSON),
    })
  }

  function createReport(stop: UnconnectedStop) {
    const report = StopReport(
      {
        title: `Unconnected stop ${stop.stop_code}`,
        message: `JORE stop ${stop.stop_code} is not connected to an OSM stop.`,
        reporter: reporterConfig.id,
      },
      {
        stopCode: stop.stop_code,
        location: {
          lat: parseFloat(stop.jore_lat),
          lon: parseFloat(stop.jore_lon),
        },
      }
    )

    const reportsTable = database.table('report')
    reportsTable.add(report)
  }

  return {
    meta: reporterMeta,
    run,
    schedule,
  }
}

export default UnconnectedStopsReporter
