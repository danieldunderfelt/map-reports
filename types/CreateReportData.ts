import { Location } from './Location'

export interface CreateReportData {
  title: string
  message?: string
  reporter: string
  location?: Location
}
