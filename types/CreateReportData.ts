import { ReportItemAlias } from './Report'

export interface ReportInput {
  message: string
  title: string
  reporter: string
}

export interface CreateReportData extends ReportInput {
  item: ReportItemAlias
}
