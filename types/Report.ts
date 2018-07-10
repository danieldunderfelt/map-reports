import { ReporterMeta } from './Reporter'
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

export type ReportItemType = 'stop' | 'missing' | 'general'

export interface ReportItem {
  location: Location
  type: ReportItemType
}

export interface StopItem extends ReportItem {
  stopCode: string
}

export type ReportItemAlias = ReportItem

export interface Report {
  id: string
  title: string
  message?: string
  reporter: ReporterMeta | string
  status: ReportStatus
  priority: ReportPriority
  item: ReportItemAlias
  createdAt: number
  updatedAt: number
}
