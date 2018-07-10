import { DateTime } from 'luxon'
import * as got from 'got'
import * as neatCsv from 'neat-csv'
import { uniqBy } from 'lodash'
import StopReport from '../reports/StopReport'
import { Reporter, ReporterConfig } from '../../types/Reporter'
import { Report } from '../../types/Report'

type UnconnectedStop = {
  stop_code: string
  jore_lat: string
  jore_lon: string
  departures: string
}

const UnconnectedStopsReporter = (
  reporterConfig: ReporterConfig,
  publishReport: (report: Report) => void,
): Reporter => {
  const reporterMeta = {
    name: 'Unconnected stops reporter',
    type: 'automatic',
    ...reporterConfig,
  }

  const csvUrl = 'http://api.digitransit.fi/routing-data/v2/hsl/unconnected.csv'
  const cron = '* 7 * * *' // at 7am every day
  let lastFetchedCsv = ''
  let lastFetchedAt: null | DateTime = null

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
    unconnectedStopsData
      .slice(0, 10)
      .forEach(stop => createReport(stop))
  }

  function createReport(stop: UnconnectedStop) {
    const report = StopReport(
      {
        title: 'Unconnected stop',
        message: `JORE stop ${stop.stop_code} is not connected to an OSM stop.`,
        reporter: reporterConfig.id,
      },
      {
        stopCode: stop.stop_code,
        location: {
          lat: parseFloat(stop.jore_lat),
          lon: parseFloat(stop.jore_lon),
        }
      },
    )

    publishReport(report)
  }

  return {
    meta: reporterMeta,
    run,
    schedule,
  }
}

export default UnconnectedStopsReporter
