import { ReportItem } from './Report'

export interface ReportInput {
  message: string
  title: string
  reporter: string
}

export interface CreateReportData<ItemType = ReportItem> extends ReportInput {
  item: ItemType
}
