import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'
import { orderBy, get, toLower, groupBy, values } from 'lodash'
import ReportStatus from '../components/ReportStatus'
import ReportPriority from '../components/ReportPriority'
import { RendersReports } from '../../types/RendersReports'
import {
  Report,
  ReportPriority as ReportPriorityEnum,
  ReportStatus as ReportStatusEnum,
} from '../../types/Report'
import SortAndFilter from '../components/SortAndFilter'
import fuzzysearch from 'fuzzysearch'
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

const sortValues = {
  reporter: obj => (obj.reporter.type === 'manual' ? 1 : 0),
  status: obj => Object.values(ReportStatusEnum).indexOf(obj.status),
  priority: obj => Object.values(ReportPriorityEnum).indexOf(obj.priority),
}

@inject(app('Report'))
@observer
class ReportsList extends React.Component<Props, any> {
  @computed
  get reports(): Report[] {
    const { state, reports = [] } = this.props
    const { sortReports, filterReports } = state

    // Group filters by the key they use
    const filterGroups = values(
      groupBy(filterReports.filter(filter => !!filter.key), 'key'),
    )

    // Include only reports that match all filters
    const filteredReports = reports.filter(report =>
      // make sure that the current report matches every filter group
      filterGroups.every(filterGroup =>
        // Filters are grouped by key. If there are many keys, treat it as an
        // "or" filter such that the report[key] value matches either filter.
        // A single filter in a group is effectively an "and" filter.
        filterGroup.some(filter =>
          // Use fuzzy search to match the filter value and the report[key] value.
          fuzzysearch(toLower(filter.value), toLower(get(report, filter.key, ''))),
        ),
      ),
    )

    // Order the filtered reports
    return orderBy<Report>(
      filteredReports,
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
    const { reports, props } = this
    const { Report: ReportStore } = props

    return (
      <div>
        <SortAndFilter reports={this.props.reports} />
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
      </div>
    )
  }
}

export default ReportsList
