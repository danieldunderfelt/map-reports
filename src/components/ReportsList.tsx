import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { RendersReports } from '../../types/RendersReports'
import FilterReports from './FilterReports'
import { app } from 'mobx-app'
import { Report as ReportType } from '../../types/Report'
import { ReportActions } from '../../types/ReportActions'
import styled from 'styled-components'
import Report from './Report'
import { AnyFunction } from '../../types/AnyFunction'
import SortReports from './SortReports'

const List = styled.div`
  width: 100%;
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
  refetchReports: AnyFunction
  reports: ReportType[]
  Report?: ReportActions
}

@inject(app('Report'))
@observer
class ReportsList extends React.Component<Props, any> {
  onRemoveReport = () => {
    this.props.refetchReports()
  }

  render() {
    const { reports = [], Report: ReportStore, fetchMore } = this.props

    return (
      <List>
        <SortReports />
        <FilterReports />
        {reports.map(report => (
          <Report
            onRemove={this.onRemoveReport}
            key={report.id}
            report={report}
            onClick={() => ReportStore.focusReport(report.id)}
          />
        ))}
        {typeof fetchMore === 'function' && (
          <button onClick={() => fetchMore()}>Fetch more</button>
        )}
      </List>
    )
  }
}

export default ReportsList
