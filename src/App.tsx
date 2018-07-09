import * as React from 'react'
import styled from 'styled-components'
import ReportsList from './views/ReportsList'
import SubmitReport from './views/SubmitReport'
import Nav from './components/Nav'
import Route from './helpers/Route'
import { query } from './helpers/Query'
import { reportsQuery } from './queries/reportsQuery'
import { get } from 'lodash'
import { Report } from '../types/Report'
import { RendersReports } from '../types/RendersReports'
import ReportsMap  from './views/ReportsMap'
import { observer } from 'mobx-react'
import routes from './routes'

const Root = styled.div`
  height: 100vh;
  display: grid;
  grid-template-columns: 25rem 1fr;
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
  state?: any
}

@query({ query: reportsQuery })
@observer
class App extends React.Component<Props, any> {
  render() {
    const { queryData } = this.props
    const reports = get(queryData, 'reports', [])

    return (
      <Root>
        <Sidebar>
          <Nav />
          <Route<RendersReports>
            path={routes.REPORTS}
            reports={reports}
            component={ReportsList}
          />
          <Route path={routes.CREATE_REPORT} component={SubmitReport} />
        </Sidebar>
        <MapArea>
          <ReportsMap reports={reports} />
        </MapArea>
      </Root>
    )
  }
}

export default App
