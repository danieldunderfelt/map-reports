import { DateTime } from 'luxon'
import * as got from 'got'
import * as neatCsv from 'neat-csv'
import StopReport from '../reports/StopReport'
import { Reporter, ReporterConfig } from '../../types/Reporter'

type UnconnectedStop = {
  stop_code: string
  jore_lat: string
  jore_lon: string
  departures: string
}

const UnconnectedStopsReporter = (reporterConfig: ReporterConfig): Reporter => {
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
    return scheduler(cron, () => {
      run()
    })
  }

  async function run() {
    if (!lastFetchedCsv) {
      const csvRequest = await got(csvUrl)
      lastFetchedCsv = csvRequest.body
    }

    const unconnectedStopsData: UnconnectedStop[] = await neatCsv(lastFetchedCsv)
    return unconnectedStopsData.map(createReport)
  }

  function createReport(stop: UnconnectedStop) {
    return StopReport(
      {
        title: 'Unconnected stop',
        message: `JORE stop ${stop.stop_code} is not connected to an OSM stop.`,
        reporter: reporterConfig.id,
      },
      {
        stopCode: stop.stop_code,
        lat: parseFloat(stop.jore_lat),
        lon: parseFloat(stop.jore_lon),
      },
    )
  }

  return {
    meta: reporterMeta,
    run,
    schedule,
  }
}

export default UnconnectedStopsReporter
