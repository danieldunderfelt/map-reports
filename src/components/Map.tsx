import * as React from 'react'
import LeafletMap from 'react-leaflet/es/Map'
import TileLayer from 'react-leaflet/es/TileLayer'
import 'leaflet/dist/leaflet.css'
import styled from 'styled-components'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

const Root = styled.div<any>`
  width: 100%;
  height: 100vh;
  overflow: hidden;
`

const MapComponent = styled(LeafletMap)`
  width: 100%;
  height: 100%;
`

const attribution = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
Imagery © <a href="http://mapbox.com">Mapbox</a>`

const url = 'https://digitransit-dev-cdn-origin.azureedge.net/map/v1/hsl-map/{z}/{x}/{y}{retina}.png'

@observer
class Map extends React.Component<any, any> {
  @observable position = [60.1689784, 24.9230033]
  @observable zoom = 13

  render() {
    return (
      <Root>
        <MapComponent
          center={this.position}
          zoom={this.zoom}
          minZoom={6}
          maxZoom={25}>
          <TileLayer
            zoomOffset={-1}
            tileSize={512}
            attribution={attribution}
            retina="@2x"
            url={url}
          />
        </MapComponent>
      </Root>
    )
  }
}

export default Map
