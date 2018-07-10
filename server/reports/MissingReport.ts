import { ReportInput } from '../../types/CreateReportData'
import { createReport } from '../createReport'
import { Location } from '../../types/Location'

/*
 * The MissingReport should be used when something that should be on the map isn't.
 * Describe the issue further in the message.
 */

const MissingReport = (reportData: ReportInput, location: Location) => {
  const report = createReport({
    ...reportData,
    item: {
      type: 'missing',
      location,
    },
  })

  return report
}

export default MissingReport
