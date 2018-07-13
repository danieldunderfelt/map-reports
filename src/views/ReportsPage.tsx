import * as React from 'react'
import styled from 'styled-components'
import ReportsMap from '../components/ReportsMap'
import ReportsList from '../components/ReportsList'
import { get } from 'lodash'
import { autorun, toJS } from 'mobx'
import { reportsQuery } from '../queries/reportsQuery'
import { app } from 'mobx-app'
import { inject, observer } from 'mobx-react'
import { query } from '../helpers/Query'
import { AnyFunction } from '../../types/AnyFunction'

const ReportsView = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 30rem 1fr;
`

const Sidebar = styled.div`
  padding-top: 1rem;
  height: calc(100vh - 4rem);
  overflow: auto;
  display: flex;
`

const MapArea = styled.div`
  height: 100%;
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
    filter: toJS(state.filterReports.filter(f => !!f.key)),
  }),
})
@observer
class ReportsPage extends React.Component<Props, any> {
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
      <ReportsView>
        <Sidebar>
          <ReportsList reports={reports} fetchMore={fetchMore} />
        </Sidebar>
        <MapArea>
          <ReportsMap reports={reports} />
        </MapArea>
      </ReportsView>
    )
  }
}

export default ReportsPage
