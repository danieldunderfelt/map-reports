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
  recommendedMapZoom?: number
}

export interface StopItem extends ReportItem {
  stopCode: string
}

export interface Report<ItemType = ReportItem> {
  id: string
  title: string
  message?: string
  reporter: ReporterMeta | string
  status: ReportStatus
  priority: ReportPriority
  item: ItemType
  createdAt: number
  updatedAt: number
}
