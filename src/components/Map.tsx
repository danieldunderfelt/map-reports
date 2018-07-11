import * as React from 'react'
import LeafletMap from 'react-leaflet/es/Map'
import TileLayer from 'react-leaflet/es/TileLayer'
import Marker from 'react-leaflet/es/Marker'
import Popup from 'react-leaflet/es/Popup'
import { observer, inject } from 'mobx-react'
import MarkerIcon from './MarkerIcon'
import { app } from 'mobx-app'
import { LatLngExpression, LeafletEvent, LeafletMouseEvent } from 'leaflet'
import { Location } from '../../types/Location'
import { MarkerState } from '../../types/Marker'
import { get } from 'lodash'
import 'leaflet/dist/leaflet.css'
import { AnyFunction } from '../../types/AnyFunction'
import { reaction } from 'mobx'

const attribution = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
Imagery © <a href="http://mapbox.com">Mapbox</a>`

const url =
  'https://digitransit-dev-cdn-origin.azureedge.net/map/v1/hsl-map/{z}/{x}/{y}{retina}.png'

interface Props {
  markers: Marker[]
  state?: any
  onMapClick: AnyFunction
  Map?: {
    setClickedLocation: (location: Location) => void
    setMapLocation: (location: LatLngExpression) => void
    setMapZoom: (zoom: number) => void
  }
}

@inject(app('Map'))
@observer
class Map extends React.Component<Props, any> {
  focusObserver = null

  componentDidMount() {
    const { state, Map: MapStore, markers } = this.props
    this.focusObserver = reaction(
      () => state.focusedReport,
      focused => {
        const focusedMarker = focused
          ? markers.find(marker => marker.id === focused)
          : null

        if (focusedMarker) {
          console.log(focusedMarker.zoom)
          MapStore.setMapLocation(focusedMarker.position)
          MapStore.setMapZoom(focusedMarker.zoom || 16)
        }
      },
    )
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

  onZoom = (event: LeafletEvent) => {
    const { Map: MapStore } = this.props
    MapStore.setMapZoom(get(event, 'target._zoom', 13))
  }

  onMove = (event: LeafletEvent) => {
    const { Map: MapStore } = this.props
    MapStore.setMapLocation(get(event, 'target._lastCenter'))
  }

  render() {
    const { markers = [], state } = this.props

    return (
      <LeafletMap
        onMove={this.onMove}
        onZoom={this.onZoom}
        onClick={this.onMapClick}
        center={state.mapLocation}
        zoom={state.mapZoom}
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
                <Popup>{message}</Popup>
              </Marker>
            ),
          )}
      </LeafletMap>
    )
  }
}

export default Map
