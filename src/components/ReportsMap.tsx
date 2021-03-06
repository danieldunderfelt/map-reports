import * as React from 'react'
import styled from 'styled-components'
import Map from './Map'
import { RendersReports } from '../../types/RendersReports'
import { inject, observer } from 'mobx-react'
import { MapModes } from '../stores/MapStore'
import { app } from 'mobx-app'
import { get } from 'lodash'
import { Marker, MarkerState } from '../../types/Marker'
import { ReportActions } from '../../types/ReportActions'
import { LatLng, latLng } from 'leaflet'

interface Props extends RendersReports {
  state?: any
  Report?: ReportActions
  useBounds?: boolean
}

export default inject(app('Report'))(
  observer(({ reports = [], state, Report, useBounds }: Props) => {
    const markers: Marker[] = reports
      .filter(report => !!get(report, 'item.location.lat', 0))
      .map(({ item: { location, type, recommendedMapZoom = 16 }, message, id }) => {
        const isInactive =
          (state.focusedReport !== null && state.focusedReport !== id) ||
          state.mapMode === MapModes.pick

        const markerPosition: LatLng = latLng(location.lat, location.lon)

        return {
          state:
            state.focusedReport === id && state.mapMode !== MapModes.pick
              ? MarkerState.focus
              : isInactive
                ? MarkerState.inactive
                : MarkerState.default,
          id,
          zoom: recommendedMapZoom,
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
        zoom: 16,
        position: latLng(
          state.lastClickedLocation.lat,
          state.lastClickedLocation.lon,
        ),
        message: 'Create new issue here.',
      })
    }

    return (
      <Map
        useBounds={useBounds}
        focusedMarker={state.focusedReport}
        onMapClick={() => Report.focusReport(null)}
        markers={markers}
      />
    )
  }),
)
