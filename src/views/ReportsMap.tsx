import * as React from 'react'
import styled from 'styled-components'
import Map from '../components/Map'
import * as L from 'leaflet'
import { LeafletMouseEvent } from 'leaflet'
import { RendersReports } from '../../types/RendersReports'
import { inject, observer } from 'mobx-react'
import { MapModes } from '../stores/MapStore'
import { app } from 'mobx-app'

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

    const markers: any[] = reports
      .filter(report => !!report.location && !!report.location.lat)
      .map(({ location, message, id }) => ({
        active: state.focusedReport === id,
        inactive:
          (state.focusedReport !== null && state.focusedReport !== id) ||
          state.mapMode === MapModes.pick,
        id,
        position: L.latLng(location.lat, location.lon),
        message,
      }))

    if (state.mapMode === MapModes.pick && state.lastClickedLocation !== null) {
      markers.push({
        active: true,
        inactive: false,
        noFocus: true,
        id: 'clicked_location',
        position: L.latLng({
          lat: state.lastClickedLocation.lat,
          lng: state.lastClickedLocation.lon,
        }),
        message: 'Create new issue here.',
      })
    }

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
