import { Report } from './Report'
import { AnyFunction } from './AnyFunction'

export interface RendersReports {
  reports?: Report[]
  fetchMore?: AnyFunction
}
