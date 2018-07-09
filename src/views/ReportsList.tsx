import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'
import { orderBy, get } from 'lodash'
import ReportStatus from '../components/ReportStatus'
import ReportPriority from '../components/ReportPriority'
import { RendersReports } from '../../types/RendersReports'
import {
  Report,
  ReportPriority as ReportPriorityEnum,
  ReportStatus as ReportStatusEnum,
} from '../../types/Report'
import SortAndFilter from '../components/SortAndFilter'

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
}

const sortValues = {
  reporter: obj => (obj.reporter.type === 'manual' ? 1 : 0),
  status: obj => Object.values(ReportStatusEnum).indexOf(obj.status),
  priority: obj => Object.values(ReportPriorityEnum).indexOf(obj.priority),
}

@inject('state')
@observer
class ReportsList extends React.Component<Props, any> {
  @computed
  get reports(): Report[] {
    const { state, reports = [] } = this.props
    const { sortReports, filterReports } = state

    return orderBy<Report>(
      reports.filter(report =>
        filterReports
          .filter(filter => !!filter.key)
          .every(filter =>
            new RegExp(filter.value, 'g').test(get(report, filter.key, '')),
          ),
      ),
      value => {
        const getSortValue = get(
          sortValues,
          sortReports.key,
          obj => obj[sortReports.key],
        )
        return getSortValue(value)
      },
      sortReports.direction,
    )
  }

  render() {
    const { reports } = this

    return (
      <div>
        <SortAndFilter reports={this.props.reports} />
        {reports.map(report => (
          <React.Fragment key={report.id}>
            <div>
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
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    )
  }
}

export default ReportsList
