import * as React from 'react'
import styled from 'styled-components'
import Map from '../components/Map'
import * as L from 'leaflet'
import { LeafletMouseEvent } from 'leaflet'
import { RendersReports } from '../../types/RendersReports'
import markerIcon from '../images/marker-icon.png'
import markerIconRetina from '../images/marker-icon-2x.png'
import markerShadow from '../images/marker-shadow.png'
import { inject, observer } from 'mobx-react'
import { MapModes } from '../stores/MapStore'
import { app } from 'mobx-app'

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;

  > * {
    width: 100%;
    height: 100%;
  }
`

interface Props extends RendersReports {
  state?: any
  Map?: {
    onMapClick: (event: LeafletMouseEvent) => void
  }
}

export default inject(app('Map'))(
  observer(({ reports = [], state, Map: MapStore }: Props) => {
    const markers =
      state.mapMode === MapModes.display
        ? reports
            .filter(report => !!report.location && !!report.location.lat)
            .map(({ location, message, id }) => ({
              id,
              position: L.latLng(location.lat, location.lon),
              message,
            }))
        : state.lastClickedLocation !== null ? [
            {
              id: 'clicked_location',
              position: L.latLng({
                lat: state.lastClickedLocation.lat,
                lng: state.lastClickedLocation.lon,
              }),
              message: 'Create new issue here.'
            },
          ] : []

    return (
      <MapContainer>
        <Map
          onMapClick={event => {
            if (state.mapMode === MapModes.pick) {
              MapStore.onMapClick(event)
            }
          }}
          markers={markers}
        />
      </MapContainer>
    )
  }),
)
