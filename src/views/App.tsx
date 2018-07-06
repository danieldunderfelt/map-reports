import * as React from 'react'
import styled from 'styled-components'
import ReportsList from './ReportsList'
import SubmitReport from './SubmitReport'
import Nav from '../components/Nav'
import Route from '../helpers/Route'
import { query } from '../helpers/Query'
import { reportsQuery } from '../queries/reportsQuery'
import { get } from 'lodash'
import { Report } from '../../types/Report'
import { RendersReports } from '../../types/RendersReports'
import ReportsMap from './ReportsMap'

const Root = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 25% 1fr;
`

const Sidebar = styled.div`
  height: 100vh;
  overflow: auto;
`

const MapArea = styled.div`
  height: 100vh;
  overflow: hidden;
`

type Props = {
  queryData?: Report[]
}

@query({ query: reportsQuery })
class App extends React.Component<Props, any> {

  render() {
    const reports = get(this, 'props.queryData.reports', [])

    return (
      <Root>
        <Sidebar>
          <Nav />
          <Route<RendersReports> path="/" reports={reports} component={ReportsList} />
          <Route path="/create-report" component={SubmitReport} />
        </Sidebar>
        <MapArea>
          <ReportsMap reports={reports} />
        </MapArea>
      </Root>
    )
  }
}

export default App
