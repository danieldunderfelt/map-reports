import * as React from 'react'
import { observer } from 'mobx-react'
import SubmitReport from '../components/SubmitReport'

@observer
class Dashboard extends React.Component<any, any> {
  render() {
    return (
      <div>
        <SubmitReport />
      </div>
    )
  }
}

export default Dashboard
