import * as React from 'react'
import LeafletMap from 'react-leaflet/es/Map'
import TileLayer from 'react-leaflet/es/TileLayer'
import Marker from 'react-leaflet/es/Marker'
import Popup from 'react-leaflet/es/Popup'
import 'leaflet/dist/leaflet.css'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

const attribution = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
Imagery © <a href="http://mapbox.com">Mapbox</a>`

const url =
  'https://digitransit-dev-cdn-origin.azureedge.net/map/v1/hsl-map/{z}/{x}/{y}{retina}.png'

@observer
class Map extends React.Component<any, any> {
  @observable position = [60.1689784, 24.9230033]
  @observable zoom = 13

  render() {
    const { markers = [], onMapClick = false } = this.props

    return (
      <LeafletMap
        onClick={typeof onMapClick === 'function' ? onMapClick : () => {}}
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
        { markers.length > 0 && markers.map(({ position, message, id }) => (
          <Marker key={`marker_${id}`} position={position}>
            <Popup>
              { message }
            </Popup>
          </Marker>
        )) }
      </LeafletMap>
    )
  }
}

export default Map
