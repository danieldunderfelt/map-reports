import { CreateReportData } from '../types/CreateReportData'
import { merge } from 'lodash'
import { Report, ReportPriority, ReportStatus } from '../types/Report'

export function createReport(data: CreateReportData, index: number): Report {
  const ts = Math.round((new Date()).getTime() / 1000)

  // Merge the received report data with some defaults for potentially
  // unsubmitted data and add props that only the server should add.
  return merge(
    {},
    {
      priority: ReportPriority.LOW,
      message: '',
      location: { lat: 0, lon: 0 }, // https://www.youtube.com/watch?v=bjvIpI-1w84
    },
    data,
    {
      id: `report_${index}`,
      status: ReportStatus.NEW,
      createdAt: ts,
      updatedAt: ts,
    },
  )
}
