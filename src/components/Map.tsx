import * as React from 'react'
import LeafletMap from 'react-leaflet/es/Map'
import TileLayer from 'react-leaflet/es/TileLayer'
import Marker from 'react-leaflet/es/Marker'
import Popup from 'react-leaflet/es/Popup'
import 'leaflet/dist/leaflet.css'
import { observer, inject } from 'mobx-react'
import MarkerIcon from './MarkerIcon'
import { app } from 'mobx-app'
import { LatLngExpression, LeafletEvent, LeafletMouseEvent } from 'leaflet'
import { Location } from '../../types/Location'
import { MarkerState } from '../../types/Marker'
import { get } from 'lodash'
import * as L from 'leaflet'

const attribution = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
Imagery © <a href="http://mapbox.com">Mapbox</a>`

const url =
  'https://digitransit-dev-cdn-origin.azureedge.net/map/v1/hsl-map/{z}/{x}/{y}{retina}.png'

let prevMapLocation: L.LatLngExpression = [60.1689784, 24.9230033]

interface Props {
  markers: Marker[]
  mapLocation: LatLngExpression
  mapZoom: number
  Map?: {
    setClickedLocation: (location: Location) => void
    setMapLocation: (location: LatLngExpression) => void
  }
}

@inject(app('Map'))
@observer
class Map extends React.Component<Props, any> {

  onMapClick = (event: LeafletMouseEvent) => {
    const { Map } = this.props
    const { lat, lng } = event.latlng

    Map.setClickedLocation({ lat, lon: lng })
  }

  onMoveEnd = (event: LeafletEvent) => {
    prevMapLocation = get(event, 'target._lastCenter')
  }

  render() {
    const {
      markers = [],
      mapLocation = prevMapLocation,
      mapZoom,
    } = this.props

    return (
      <LeafletMap
        onMoveend={this.onMoveEnd}
        onClick={this.onMapClick}
        center={mapLocation}
        zoom={mapZoom}
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
          markers.map(({ type, position, message, id, state: markerState, onClick }) => (
            <Marker
              onClick={onClick}
              key={`marker_${id}`}
              position={position}
              icon={MarkerIcon({
                type,
                focused: markerState === MarkerState.focus,
                blurred: markerState === MarkerState.inactive,
              })}>
              <Popup>{message}</Popup>
            </Marker>
          ))}
      </LeafletMap>
    )
  }
}

export default Map
