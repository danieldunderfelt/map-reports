import * as React from 'react'
import styled from 'styled-components'
import SubmitReport from '../components/SubmitReport'
import ReportsMap from '../components/ReportsMap'

const CreateReportView = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 30rem 1fr;
`

const Sidebar = styled.div`
  height: calc(100vh - 4rem);
  overflow: auto;
  display: flex;
`

const MapArea = styled.div`
  height: 100%;
`

export default () => (
  <CreateReportView>
    <Sidebar>
      <SubmitReport />
    </Sidebar>
    <MapArea>
      <ReportsMap useBounds={false} />
    </MapArea>
  </CreateReportView>
)
