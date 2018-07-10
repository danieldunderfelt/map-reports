import * as React from 'react'
import LeafletMap from 'react-leaflet/es/Map'
import TileLayer from 'react-leaflet/es/TileLayer'
import Marker from 'react-leaflet/es/Marker'
import Popup from 'react-leaflet/es/Popup'
import 'leaflet/dist/leaflet.css'
import { observer, inject} from 'mobx-react'
import MarkerIcon from './MarkerIcon'
import { app } from 'mobx-app'

const attribution = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
Imagery © <a href="http://mapbox.com">Mapbox</a>`

const url =
  'https://digitransit-dev-cdn-origin.azureedge.net/map/v1/hsl-map/{z}/{x}/{y}{retina}.png'

@inject(app('Map'))
@observer
class Map extends React.Component<any, any> {
  defaultPosition = [60.1689784, 24.9230033]

  getMapPosition() {
    const { markers } = this.props

    return markers.reduce(
      (selected, marker) => (marker.active && !marker.noFocus ? marker.position : selected),
      this.defaultPosition,
    )
  }

  render() {
    const { markers = [], onMapClick = false } = this.props

    const position = this.getMapPosition()
    const zoom = position !== this.defaultPosition ? 16 : 13

    return (
      <LeafletMap
        onClick={typeof onMapClick === 'function' ? onMapClick : () => {}}
        center={position}
        zoom={zoom}
        minZoom={6}
        maxZoom={25}>
        <TileLayer
          zoomOffset={-1}
          tileSize={512}
          attribution={attribution}
          retina="@2x"
          url={url}
        />
        {markers.length > 0 &&
          markers.map(
            ({ position, message, id, active = false, inactive = false, onClick }) => (
              <Marker
                onClick={onClick}
                key={`marker_${id}`}
                position={position}
                icon={MarkerIcon({ focused: active, blurred: inactive })}>
                <Popup>{message}</Popup>
              </Marker>
            ),
          )}
      </LeafletMap>
    )
  }
}

export default Map
