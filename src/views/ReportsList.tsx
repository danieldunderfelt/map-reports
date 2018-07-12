import * as React from 'react'
import { observer, inject } from 'mobx-react'
import ReportStatus from '../components/ReportStatus'
import ReportPriority from '../components/ReportPriority'
import { RendersReports } from '../../types/RendersReports'
import {
  Report,
  ReportPriority as ReportPriorityEnum,
  ReportStatus as ReportStatusEnum,
} from '../../types/Report'
import SortAndFilter from '../components/SortAndFilter'
import { app } from 'mobx-app'
import { ReportActions } from '../../types/ReportActions'
import styled from 'styled-components'

const Report = styled.div`
  cursor: pointer;
  padding: 1rem;
  border-bottom: 1px solid #ccc;

  > h2 {
    margin-top: 0;
    margin-bottom: 0;
  }
`

interface Props extends RendersReports {
  state?: {
    sortReports: {
      key: string
      direction: string
    }
    filterReports: {
      key: string
      value: string
    }[]
  }
  reports: Report[]
  Report?: ReportActions
}

@inject(app('Report'))
@observer
class ReportsList extends React.Component<Props, any> {

  render() {
    const { reports, Report: ReportStore, fetchMore } = this.props

    return (
      <div>
        <SortAndFilter reports={reports} />
        {reports.map(report => (
          <Report key={report.id} onClick={() => ReportStore.focusReport(report.id)}>
            <h2>{report.title}</h2>
            <p>{report.message}</p>
            <h4>
              Reported by:{' '}
              {typeof report.reporter === 'string'
                ? report.reporter
                : report.reporter.name}
            </h4>
            <p>
              <ReportStatus report={report} readOnly={false} />
              <br />
              <ReportPriority report={report} readOnly={false} />
            </p>
          </Report>
        ))}
        { typeof fetchMore === 'function' && (
          <button onClick={() => fetchMore()}>
            Fetch more
          </button>
        )}
      </div>
    )
  }
}

export default ReportsList
