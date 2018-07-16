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
  pointToLayer?: AnyFunction
  onEachFeature?: AnyFunction
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
  position: relative;

  > .leaflet-container {
    width: 100%;
    height: 100%;
    z-index: 0;
  }
`

const CenterButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: auto;
  height: auto;
  z-index: 100;
`

const defaultMapLocation: LatLng = latLng(60.1689784, 24.9230033)
const defaultMapZoom = 13

@inject(app('Map'))
@observer
class Map extends React.Component<Props, any> {
  mapRef = React.createRef()
  center = defaultMapLocation
  zoom = defaultMapZoom
  bounds

  componentWillUpdate({ markers, geoJSON, useBounds = true }: Props) {
    this.bounds = useBounds && markers ? this.calculateMarkerBounds(markers) : undefined
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

    const marker = focusedMarker && markers.length > 0
      ? markers.find(marker => marker.id === focusedMarker)
      : null

    if (!marker) {
      return {
        center: this.center,
        zoom: this.zoom,
      }
    }

    const { zoom: markerZoom = 16, position } = marker

    this.center = position
    this.zoom = markerZoom

    return {
      center: this.center,
      zoom: this.zoom,
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

  centerOnHelsinki = e => {
    e.preventDefault()
    this.center = defaultMapLocation
    this.zoom = defaultMapZoom
    this.setState({})
  }

  trackViewport = ({ center: viewportCenter = this.center, zoom: viewportZoom = this.zoom }) => {
    const centerLatLng = latLng(viewportCenter[0], viewportCenter[1])
    this.center = centerLatLng
    this.zoom = viewportZoom
    this.setState({})
  }

  render() {
    const { markers = [], geoJSON, pointToLayer, onEachFeature } = this.props
    const { center: mapCenter, zoom: mapZoom } = this.getFocusedPosition()

    return (
      <MapContainer>
        <LeafletMap
          onViewportChanged={this.trackViewport}
          bounds={this.bounds}
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
                onEachFeature={onEachFeature}
                pointToLayer={pointToLayer}
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
        <CenterButton onClick={this.centerOnHelsinki}>Center on Helsinki</CenterButton>
      </MapContainer>
    )
  }
}

export default Map
