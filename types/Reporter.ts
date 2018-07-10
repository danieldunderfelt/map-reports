import { Report } from './Report'
import { ScheduledTask, schedule } from 'node-cron'

export type ReporterConfig = {
  id: string
  name?: string
  type?: string
}

export interface ReporterMeta {
  id: string
  name: string
  type: string
}

export type ReporterRun = () => Promise<Report[]>

export interface Reporter {
  meta: ReporterMeta
  run: ReporterRun
  schedule: (
    scheduler: typeof schedule,
  ) => ScheduledTask
}
