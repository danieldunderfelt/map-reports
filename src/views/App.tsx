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
import ReportsMap, { MapModes } from './ReportsMap'
import { inject, observer } from 'mobx-react'
import { RouterType } from 'pathricia'
import routes from '../routes'

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
  state?: any
}

@query({ query: reportsQuery })
@inject('state')
@observer
class App extends React.Component<Props, any> {
  render() {
    const { queryData, state } = this.props
    const reports = get(queryData, 'reports', [])

    const mapMode =
      state.route === routes.CREATE_REPORT ? MapModes.pick : MapModes.display

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
          <ReportsMap mapMode={mapMode} reports={reports} />
        </MapArea>
      </Root>
    )
  }
}

export default App
