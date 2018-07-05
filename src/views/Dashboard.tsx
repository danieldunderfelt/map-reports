import * as React from 'react'
import { observer } from 'mobx-react'
import ReportsList from '../components/ReportsList'

@observer
class Dashboard extends React.Component<any, any> {
  render() {
    return (
      <div>
        <ReportsList />
      </div>
    )
  }
}

export default Dashboard
