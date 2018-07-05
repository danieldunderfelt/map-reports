import * as React from 'react'
import { observer } from 'mobx-react'
import { query } from '../helpers/Query'
import { AnyFunction } from '../../types/AnyFunction'
import { reportsQuery } from '../queries/reportsQuery'

type Props = {
  startPolling?: AnyFunction
  stopPolling?: AnyFunction
  data?: any
}

@query({ query: reportsQuery })
@observer
class ReportsList extends React.Component<Props, any> {

  render() {
    const { data } = this.props

    return data.reports.map(report => (
      <React.Fragment key={report.id}>
        <div>
          <h2>{report.title}</h2>
          <p>{report.message}</p>
          <h4>Reported by: {report.reporter.name}</h4>
        </div>
        <hr />
      </React.Fragment>
    ))
  }
}

export default ReportsList
