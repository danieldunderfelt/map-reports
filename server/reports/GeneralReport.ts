import { ReportDataInput } from '../../types/CreateReportData'
import { createReport } from './createReport'
import { Location } from '../../types/Location'

/*
 * The MissingReport should be used when something that should be on the map isn't.
 * Describe the issue further in the message.
 */

const GeneralReport = (reportData: ReportDataInput, location: Location) => {
  const report = createReport(reportData, {
    type: 'general',
    location,
    recommendedMapZoom: 16,
  })

  return report
}

export default GeneralReport
