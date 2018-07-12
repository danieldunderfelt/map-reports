import * as React from 'react'
import LeafletMap from 'react-leaflet/es/Map'
import TileLayer from 'react-leaflet/es/TileLayer'
import Marker from 'react-leaflet/es/Marker'
import Popup from 'react-leaflet/es/Popup'
import { observer, inject } from 'mobx-react'
import MarkerIcon from './MarkerIcon'
import { app } from 'mobx-app'
import { throttle } from 'lodash'
import { LatLng, latLng, LatLngExpression, LeafletMouseEvent, marker } from 'leaflet'
import { Location } from '../../types/Location'
import { MarkerState } from '../../types/Marker'
import 'leaflet/dist/leaflet.css'
import { AnyFunction } from '../../types/AnyFunction'

const attribution = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
Imagery © <a href="http://mapbox.com">Mapbox</a>`

const url =
  'https://digitransit-dev-cdn-origin.azureedge.net/map/v1/hsl-map/{z}/{x}/{y}{retina}.png'

interface Props {
  markers: Marker[]
  onMapClick: AnyFunction
  focusedMarker?: string
  Map?: {
    setClickedLocation: (location: Location) => void
    setMapLocation: (location: LatLngExpression) => void
    setMapZoom: (zoom: number) => void
  }
}

interface State {
  center: LatLng
  zoom: number
}

const defaultMapLocation: LatLng = latLng(60.1689784, 24.9230033)
const defaultMapZoom = 13

let center = defaultMapLocation
let zoom = defaultMapZoom

@inject(app('Map'))
@observer
class Map extends React.Component<Props, State> {
  mapRef = React.createRef()

  // Get the position for the currently focused marker or return
  // the default center and zoom values if no marker is focused.
  getFocusedPosition = () => {
    const { focusedMarker, markers } = this.props

    const marker = focusedMarker
      ? markers.find(marker => marker.id === focusedMarker)
      : null

    if (!marker) {
      return {
        center,
        zoom,
      }
    }

    const { zoom: markerZoom = 16, position } = marker

    console.log(markerZoom)

    return {
      center: position,
      zoom: markerZoom,
    }
  }

  onMarkerClick = markerClickHandler => (event: LeafletMouseEvent) => {
    markerClickHandler(event)
  }

  onMapClick = (event: LeafletMouseEvent) => {
    const { Map: MapStore, onMapClick } = this.props
    const { lat, lng } = event.latlng

    MapStore.setClickedLocation({ lat, lon: lng })
    onMapClick(event)
  }

  trackViewport = ({ center: viewportCenter, zoom: viewportZoom }) => {
    const centerLatLng = latLng(viewportCenter[0], viewportCenter[1])
    center = centerLatLng
    zoom = viewportZoom
  }

  render() {
    const { markers = [] } = this.props
    const { center: mapCenter, zoom: mapZoom } = this.getFocusedPosition()

    return (
      <LeafletMap
        onViewportChange={this.trackViewport}
        onClick={this.onMapClick}
        center={mapCenter}
        zoom={mapZoom}
        ref={this.mapRef}
        minZoom={10}
        maxZoom={18}>
        <TileLayer
          zoomOffset={-1}
          tileSize={512}
          attribution={attribution}
          retina="@2x"
          url={url}
        />
        {markers.length > 0 &&
          markers.map(
            ({ type, position, message, id, state: markerState, onClick }) => (
              <Marker
                onClick={this.onMarkerClick(onClick)}
                key={`marker_${id}`}
                position={position}
                icon={MarkerIcon({
                  type,
                  focused: markerState === MarkerState.focus,
                  blurred: markerState === MarkerState.inactive,
                })}>
                {message && <Popup>{message}</Popup>}
              </Marker>
            ),
          )}
      </LeafletMap>
    )
  }
}

export default Map
