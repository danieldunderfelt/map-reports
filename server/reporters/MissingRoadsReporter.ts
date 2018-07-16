import { DateTime } from 'luxon'
import { Reporter, ReporterConfig } from '../../types/Reporter'
import fs from 'fs-extra'
import { merge } from '@mapbox/geojson-merge'
import path from 'path'

const MissingRoadsReporter = (
  reporterConfig: ReporterConfig,
  database: any
): Reporter => {
  const reporterMeta = {
    name: 'Missing roads reporter',
    type: 'automatic',
    dataset: 'missing_roads',
    ...reporterConfig,
  }

  database.table('reporter').add(reporterMeta)

  const cron = '* 6 * * *' // at 6am every day

  function schedule(scheduler) {
    return scheduler(cron, () => run())
  }

  async function run() {
    const missingRoadsGeoJson = await fs.readJSON(path.join(__dirname, 'assets/osm_puuttuvat_tiet.geojson'))
    const missingPathsGeoJson = await fs.readJSON(path.join(__dirname, './assets/puuttuvat_polut.geojson'))

    const combined = merge([missingRoadsGeoJson, missingPathsGeoJson])

    const datasetsTable = database.table('datasets')

    datasetsTable.updateOrAdd(reporterMeta.dataset, {
      id: reporterMeta.dataset,
      label: 'Missing roads',
      geoJSON: JSON.stringify(combined),
    })
  }

  return {
    meta: reporterMeta,
    run,
    schedule,
  }
}

export default MissingRoadsReporter
