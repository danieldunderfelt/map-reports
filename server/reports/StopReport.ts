import { createReport } from '../createReport'
import { ReportInput } from '../../types/CreateReportData'

type ReportedStop = { stopCode: string; lat: number; lon: number }

/**
 * The StopReport type is used when the stop on the map does not match
 * with the reality on the ground or in JoRe. The location of the item
 * is where the stop should be on the map.
 */

const StopReport = (reportData: ReportInput, stop: ReportedStop) => {
  const report = createReport({
    ...reportData,
    item: {
      type: 'stop',
      stopCode: stop.stopCode,
      location: { lat: stop.lat, lon: stop.lon },
    },
  })

  return report
}

export default StopReport
