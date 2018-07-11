import * as React from 'react'
import styled from 'styled-components'
import Map from '../components/Map'
import { RendersReports } from '../../types/RendersReports'
import { inject, observer } from 'mobx-react'
import { MapModes } from '../stores/MapStore'
import { app } from 'mobx-app'
import { get } from 'lodash'
import { Marker, MarkerState } from '../../types/Marker'
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

interface Props extends RendersReports {
  state?: any
  Report?: ReportActions
}

export default inject(app('Report'))(
  observer(({ reports = [], state, Report }: Props) => {
    const markers: Marker[] = reports
      .filter(report => !!get(report, 'item.location.lat', 0))
      .map(({ item: { location, type }, message, id }) => {
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
          type,
          position: markerPosition,
          message,
          onClick: () => Report.focusReport(id),
        }
      })

    if (state.mapMode === MapModes.pick && state.lastClickedLocation !== null) {
      markers.push({
        type: 'new-report',
        state: MarkerState.focus,
        id: 'clicked_location',
        position: [state.lastClickedLocation.lat, state.lastClickedLocation.lon],
        message: 'Create new issue here.',
      })
    }

    return (
      <MapContainer>
        <Map
          onMapClick={() => {
            if (state.mapMode !== MapModes.pick) {
              Report.focusReport(null)
            }
          }}
          markers={markers}
        />
      </MapContainer>
    )
  }),
)
