import { CreateReportData } from '../types/CreateReportData'
import { merge } from 'lodash'
import { Report, ReportPriority, ReportStatus } from '../types/Report'
import { generate } from 'shortid'

export function createReport(data: CreateReportData): Report {
  const ts = Math.round(new Date().getTime() / 1000)

  // Merge the received report data with some defaults for potentially
  // unsubmitted data and add props that only the server should add.
  return merge(
    {
      priority: ReportPriority.LOW,
      message: '',
    },
    data,
    {
      id: generate(),
      status: ReportStatus.NEW,
      createdAt: ts,
      updatedAt: ts,
    },
  )
}
