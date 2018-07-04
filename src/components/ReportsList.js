import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { query } from '../helpers/Query'
import gql from 'graphql-tag'
import { ReportFragment } from '../fragments/ReportFragment'

const reportsQuery = gql`
  {
    reports {
      ...ReportFields
    }
  }
  ${ReportFragment}
`

@query({ query: reportsQuery })
@observer
class ReportsList extends Component {
  componentDidMount() {
    this.props.startPolling(500)
  }

  componentWillUnmount() {
    this.props.stopPolling()
  }

  render() {
    const { data } = this.props

    return data.reports.map(report => (
      <React.Fragment key={report.id}>
        <div>
          <h2>{report.title}</h2>
          <p>{report.body}</p>
          <h4>Reported by: {report.reporter.name}</h4>
        </div>
        <hr />
      </React.Fragment>
    ))
  }
}

export default ReportsList
