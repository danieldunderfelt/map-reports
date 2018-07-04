import React, { Component } from 'react'
import { observer } from 'mobx-react'
import ReportsList from '../components/ReportsList'
import SubmitReport from '../components/SubmitReport'

@observer
class Dashboard extends Component {
  render() {
    return (
      <div>
        <SubmitReport />
        <ReportsList />
      </div>
    )
  }
}

export default Dashboard
