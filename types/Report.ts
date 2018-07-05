import { Reporter } from './Reporter'
import { Location } from './Location'

export enum ReportStatus {
  NEW = 'NEW',
  ACCEPTED = 'ACCEPTED',
  WIP = 'WIP',
  DONE = 'DONE',
  REJECTED = 'REJECTED',
}

export enum ReportPriority {
  LOW = 'LOW',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Report {
  id: string
  title: string
  message?: string
  reporter: Reporter | string
  status: ReportStatus
  priority: ReportPriority
  location?: Location
  createdAt: number
  updatedAt: number
}
