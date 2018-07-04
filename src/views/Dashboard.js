import React, { Component } from 'react'
import { observer } from 'mobx-react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const reportsQuery = gql`
  {
    reports {
      title
      body
      reporter {
        id
        name
        type
      }
    }
  }
`

@observer
class Dashboard extends Component {
  render() {
    return (
      <div>
        <Query query={reportsQuery}>
          {({ data, loading }) =>
            !loading &&
            data.reports.map(report => (
              <React.Fragment>
                <div key={report.title}>
                  <h2>{report.title}</h2>
                  <p>{report.body}</p>
                  <h4>Reported by: {report.reporter.name}</h4>
                </div>
                <hr />
              </React.Fragment>
            ))
          }
        </Query>
      </div>
    )
  }
}

export default Dashboard
