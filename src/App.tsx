import * as React from 'react'
import styled from 'styled-components'
import ReportsList from './views/ReportsList'
import SubmitReport from './views/SubmitReport'
import Nav from './components/Nav'
import Route from './helpers/Route'
import { reportsQuery } from './queries/reportsQuery'
import { get } from 'lodash'
import { RendersReports } from '../types/RendersReports'
import ReportsMap from './views/ReportsMap'
import { observer, inject } from 'mobx-react'
import routes from './routes'
import { app } from 'mobx-app'
import { autorun, reaction, toJS } from 'mobx'
import { query } from './helpers/Query'
import { AnyFunction } from '../types/AnyFunction'

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
  state?: any
  queryData?: any
  fetchMore?: AnyFunction
  refetch?: AnyFunction
}

@inject(app('state'))
@query({
  query: reportsQuery,
  getVariables: ({ state }) => ({
    perPage: 10,
    sort: toJS(state.sortReports),
    filter: toJS(state.filterReports.filter(f => !!f.key && !!f.value)),
  }),
})
@observer
class App extends React.Component<Props, any> {
  componentDidMount() {
    const { state, refetch } = this.props

    autorun(() => {
      refetch({ filter: toJS(state.filterReports) })
    })
  }

  render() {
    const { queryData, fetchMore } = this.props

    const queryName = 'reportsConnection'
    const reports = get(queryData, `${queryName}.edges`, []).map(edge => edge.node)

    return (
      <Root>
        <Sidebar>
          <Nav />
          <Route<RendersReports>
            path={routes.REPORTS}
            reports={reports}
            fetchMore={fetchMore}
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
