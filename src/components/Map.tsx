import * as React from 'react'
import LeafletMap from 'react-leaflet/es/Map'
import TileLayer from 'react-leaflet/es/TileLayer'
import Marker from 'react-leaflet/es/Marker'
import GeoJSON from 'react-leaflet/es/GeoJSON'
import Popup from 'react-leaflet/es/Popup'
import { observer, inject } from 'mobx-react'
import MarkerIcon from './MarkerIcon'
import { app } from 'mobx-app'
import {
  point,
  LatLng,
  latLng,
  LatLngExpression,
  LeafletMouseEvent,
  divIcon,
  marker,
  latLngBounds,
  popup,
} from 'leaflet'
import { Location } from '../../types/Location'
import { MarkerState } from '../../types/Marker'
import 'leaflet/dist/leaflet.css'
import { AnyFunction } from '../../types/AnyFunction'
import styled from 'styled-components'
import MarkerClusterGroup from './MarkerClusterGroup'

const attribution = `Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors,
<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,
Imagery © <a href="http://mapbox.com">Mapbox</a>`

const url =
  'https://digitransit-dev-cdn-origin.azureedge.net/map/v1/hsl-map/{z}/{x}/{y}{retina}.png'

interface Props {
  useBounds?: boolean
  markers?: Marker[]
  onMapClick?: AnyFunction
  focusedMarker?: string
  geoJSON?: any
  getMarkerMessage?: AnyFunction
  Map?: {
    setClickedLocation: (location: Location) => void
    setMapLocation: (location: LatLngExpression) => void
    setMapZoom: (zoom: number) => void
  }
}

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;

  > * {
    width: 100%;
    height: 100%;
  }
`

const defaultMapLocation: LatLng = latLng(60.1689784, 24.9230033)
const defaultMapZoom = 13

let center = defaultMapLocation
let zoom = defaultMapZoom
let bounds

@inject(app('Map'))
@observer
class Map extends React.Component<Props, any> {
  mapRef = React.createRef()

  componentWillUpdate({ markers, geoJSON, useBounds = true }: Props) {
    bounds = useBounds && markers ? this.calculateMarkerBounds(markers) : undefined
  }

  calculateMarkerBounds = markers => {
    let latMin = defaultMapLocation.lat
    let lngMin = defaultMapLocation.lng
    let latMax = latMin
    let lngMax = lngMin

    markers.forEach(marker => {
      latMin = Math.min(latMin, marker.position.lat)
      lngMin = Math.min(lngMin, marker.position.lng)
      latMax = Math.max(latMax, marker.position.lat)
      lngMax = Math.max(lngMax, marker.position.lng)
    })

    return latLngBounds([[latMin, lngMin], [latMax, lngMax]])
  }

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

    center = position
    zoom = markerZoom

    return {
      center,
      zoom,
    }
  }

  onMarkerClick = markerClickHandler => (event: LeafletMouseEvent) => {
    markerClickHandler(event)
  }

  onMapClick = (event: LeafletMouseEvent) => {
    const { Map: MapStore, onMapClick = () => {} } = this.props
    const { lat, lng } = event.latlng

    MapStore.setClickedLocation({ lat, lon: lng })
    onMapClick(event)
  }

  trackViewport = ({ center: viewportCenter, zoom: viewportZoom }) => {
    const centerLatLng = latLng(viewportCenter[0], viewportCenter[1])
    center = centerLatLng
    zoom = viewportZoom
  }

  defaultMarkerMessage = ({ message }) => message

  render() {
    const {
      markers = [],
      geoJSON,
      getMarkerMessage = this.defaultMarkerMessage,
    } = this.props
    const { center: mapCenter, zoom: mapZoom } = this.getFocusedPosition()

    return (
      <MapContainer>
        <LeafletMap
          onViewportChange={this.trackViewport}
          bounds={bounds}
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
          {geoJSON && (
            <MarkerClusterGroup>
              <GeoJSON
                data={geoJSON}
                pointToLayer={(geoJsonPoint, latlng) => {
                  const bubble = popup().setContent(getMarkerMessage(geoJsonPoint))

                  return marker(latlng, {
                    icon: MarkerIcon({ type: 'general' }),
                  }).bindPopup(bubble)
                }}
              />
            </MarkerClusterGroup>
          )}
          {markers.length > 0 && (
            <MarkerClusterGroup>
              {markers.map(
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
                )
              )}
            </MarkerClusterGroup>
          )}
        </LeafletMap>
      </MapContainer>
    )
  }
}

export default Map
