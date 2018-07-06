import * as React from 'react'
import styled from 'styled-components'
import ReportsList from './ReportsList'
import SubmitReport from './SubmitReport'
import Nav from '../components/Nav'
import Route from '../helpers/Route'
import Map from '../components/Map'

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

class App extends React.Component<{}, {}> {

  render() {

    return (
      <Root>
        <Sidebar>
          <Nav />
          <Route path="/" component={ReportsList} />
          <Route path="/create-report" component={SubmitReport} />
        </Sidebar>
        <MapArea>
          <Map />
        </MapArea>
      </Root>
    )
  }
}

export default App
