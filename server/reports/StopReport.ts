import { createReport } from '../createReport'
import { ReportInput } from '../../types/CreateReportData'
import { StopItem } from '../../types/Report'
import { Location } from '../../types/Location'

type ReportedStop = {
  stopCode: string
  location: Location
}

/**
 * The StopReport type is used when the stop on the map does not match
 * with the reality on the ground or in JoRe. The location of the item
 * is where the stop should be on the map.
 */

const StopReport = (reportData: ReportInput, stop : ReportedStop) => {
  const report = createReport<StopItem>({
    ...reportData,
    item: {
      type: 'stop',
      ...stop
    },
  })

  return report
}

export default StopReport
