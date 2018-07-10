import { CreateReportData } from '../types/CreateReportData'
import { merge } from 'lodash'
import { Report, ReportItem, ReportPriority, ReportStatus } from '../types/Report'
import { generate } from 'shortid'

export function createReport<ItemType = ReportItem>(
  data: CreateReportData<ItemType>,
): Report<ItemType> {
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
