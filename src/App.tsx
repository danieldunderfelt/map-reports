import * as React from 'react'
import styled from 'styled-components'
import ReportsList from './views/ReportsList'
import SubmitReport from './views/SubmitReport'
import Nav from './components/Nav'
import Route from './helpers/Route'
import { Query } from 'react-apollo'
import { reportsQuery } from './queries/reportsQuery'
import { get, has } from 'lodash'
import { RendersReports } from '../types/RendersReports'
import ReportsMap from './views/ReportsMap'
import { observer, inject } from 'mobx-react'
import routes from './routes'
import { app } from 'mobx-app'
import { toJS } from 'mobx'
import { createPaginator } from './helpers/paginate'

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
}

@inject(app('state'))
@observer
class App extends React.Component<Props, any> {
  render() {
    const { sortReports, filterReports } = this.props.state

    return (
      <Root>
        <Query
          variables={{
            perPage: 10,
            sort: toJS(sortReports),
            filter: toJS(filterReports),
          }}
          query={reportsQuery}>
          {({ data, fetchMore }) => {
            const queryName = 'reportsConnection'
            const reports = get(data, `${queryName}.edges`, []).map(edge => edge.node)

            const paginator =
              has(data, `${queryName}.edges`) && has(data, `${queryName}.pageInfo`)
                ? createPaginator(data[queryName], queryName, fetchMore)
                : null

            return (
              <>
                <Sidebar>
                  <Nav />
                  <Route<RendersReports>
                    path={routes.REPORTS}
                    reports={reports}
                    fetchMore={paginator}
                    component={ReportsList}
                  />
                  <Route path={routes.CREATE_REPORT} component={SubmitReport} />
                </Sidebar>
                <MapArea>
                  <ReportsMap reports={reports} />
                </MapArea>
              </>
            )
          }}
        </Query>
      </Root>
    )
  }
}

export default App
