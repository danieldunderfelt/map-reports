import { merge } from 'lodash'
import {
  Report,
  ReportItem,
  ReportPriority,
  ReportStatus,
} from '../../types/Report'
import { generate } from 'shortid'
import { ReportDataInput } from '../../types/CreateReportData'

export function createReport(
  reportData: ReportDataInput,
  reportItem: ReportItem
): Report {
  const ts = Math.round(new Date().getTime() / 1000)

  // Merge the received report data with some defaults for potentially
  // unsubmitted data and add props that only the server should add.
  return merge(
    {
      priority: ReportPriority.LOW,
      message: '',
    },
    reportData,
    { item: reportItem },
    {
      id: generate(),
      status: ReportStatus.NEW,
      createdAt: ts,
      updatedAt: ts,
    }
  )
}
