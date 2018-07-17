import * as React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Report, ReportStatus as ReportStatusEnum } from '../../types/Report'
import { filterOptionsQuery } from './FilterReports'

type Props = {
  report: Report
  readOnly?: boolean
}

const setStatusMutation = gql`
  mutation setStatus($reportId: String!, $newStatus: ReportStatus) {
    setStatus(reportId: $reportId, newStatus: $newStatus) {
      id
      status
      updatedAt
    }
  }
`

class ReportStatus extends React.Component<Props, any> {
  render() {
    const { report, readOnly = true } = this.props

    return readOnly ? (
      <>Status: {report.status}</>
    ) : (
      <Mutation
        mutation={setStatusMutation}
        refetchQueries={() => [{ query: filterOptionsQuery }]}>
        {mutate => (
          <>
            Status:{' '}
            <select
              onChange={e =>
                mutate({
                  variables: {
                    reportId: report.id,
                    newStatus: e.target.value,
                  },
                })
              }
              value={report.status}>
              {Object.values(ReportStatusEnum).map(status => (
                <option key={`status_option_${status}`} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </>
        )}
      </Mutation>
    )
  }
}

export default ReportStatus
