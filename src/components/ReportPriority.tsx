import * as React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Report, ReportPriority as ReportPriorityEnum } from '../../types/Report'
import { filterOptionsQuery } from './SortAndFilter'

type Props = {
  report: Report
  readOnly?: boolean
}

const setPriorityMutation = gql`
  mutation setPriority($reportId: String!, $newPriority: ReportPriority) {
    setPriority(reportId: $reportId, newPriority: $newPriority) {
      id
      priority
      updatedAt
    }
  }
`

class ReportPriority extends React.Component<Props, any> {
  render() {
    const { report, readOnly = true } = this.props

    return readOnly ? (
      <>Priority: {report.priority}</>
    ) : (
      <Mutation
        mutation={setPriorityMutation}
        refetchQueries={() => [{ query: filterOptionsQuery }]}>
        {mutate => (
          <>
            Priority:{' '}
            <select
              onChange={e =>
                mutate({
                  variables: {
                    reportId: report.id,
                    newPriority: e.target.value,
                  },
                })
              }
              value={report.priority}>
              {Object.values(ReportPriorityEnum).map(priority => (
                <option key={`priority_option_${priority}`} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </>
        )}
      </Mutation>
    )
  }
}

export default ReportPriority
