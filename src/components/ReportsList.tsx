import * as React from 'react'
import { observer } from 'mobx-react'
import { query } from '../helpers/Query'
import gql from 'graphql-tag'
import { ReportFragment } from '../fragments/ReportFragment'
import { AnyFunction } from '../../types/AnyFunction'

const reportsQuery = gql`
  {
    reports {
      ...ReportFields
    }
  }
  ${ReportFragment}
`

type Props = {
  startPolling?: AnyFunction
  stopPolling?: AnyFunction
  data?: any
}

@query({ query: reportsQuery })
@observer
class ReportsList extends React.Component<Props, any> {
  componentDidMount() {
    this.props.startPolling(500)
  }

  componentWillUnmount() {
    this.props.stopPolling()
  }

  render() {
    const { data } = this.props

    console.log(data)

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
