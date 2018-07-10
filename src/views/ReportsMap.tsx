import * as React from 'react'
import styled from 'styled-components'
import Map from '../components/Map'
import * as L from 'leaflet'
import { RendersReports } from '../../types/RendersReports'
import { inject, observer } from 'mobx-react'
import { MapModes } from '../stores/MapStore'
import { app } from 'mobx-app'
import { get } from 'lodash'
import { Marker, MarkerState } from '../../types/Marker'
import { AnyFunction } from '../../types/AnyFunction'
import { ReportActions } from '../../types/ReportActions'
import { LatLngExpression } from 'leaflet'

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;

  > * {
    width: 100%;
    height: 100%;
  }
`

const defaultMapZoom = 13

interface Props extends RendersReports {
  state?: any
  Report?: ReportActions
}

export default inject(app('Report'))(
  observer(({ reports = [], state, Report }: Props) => {
    const markers: Marker[] = reports
      .filter(report => !!get(report, 'item.location.lat', 0))
      .map(({ item: { location }, message, id }) => {
        const isInactive =
          (state.focusedReport !== null && state.focusedReport !== id) ||
          state.mapMode === MapModes.pick

        const markerPosition: LatLngExpression = [location.lat, location.lon]

        return {
          state:
            state.focusedReport === id && state.mapMode !== MapModes.pick
              ? MarkerState.focus
              : isInactive
                ? MarkerState.inactive
                : MarkerState.default,
          id,
          position: markerPosition,
          message,
          onClick: () => Report.focusReport(id),
        }
      })

    if (state.mapMode === MapModes.pick && state.lastClickedLocation !== null) {
      markers.push({
        state: MarkerState.focus,
        id: 'clicked_location',
        position: [state.lastClickedLocation.lat, state.lastClickedLocation.lon],
        message: 'Create new issue here.',
      })
    }

    let location
    let zoom = defaultMapZoom

    const focusedMarker =
      state.focusedReport !== null && markers.find(m => m.id === state.focusedReport)

    if (focusedMarker) {
      location = focusedMarker.position
      zoom = 16
    }

    return (
      <MapContainer>
        <Map mapLocation={location} mapZoom={zoom} markers={markers} />
      </MapContainer>
    )
  }),
)
