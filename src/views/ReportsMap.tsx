import * as React from 'react'
import styled from 'styled-components'
import Map from '../components/Map'
import * as L from 'leaflet'
import { RendersReports } from '../../types/RendersReports'
import markerIcon from '../images/marker-icon.png'
import markerIconRetina from '../images/marker-icon-2x.png'
import markerShadow from '../images/marker-shadow.png'

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

export const enum MapModes {
  pick = 'pick',
  display = 'display'
}

interface Props extends RendersReports {
  mapMode: MapModes
}

export default ({ reports = [], mapMode }: Props) => {
  console.log(mapMode)

  const markers = mapMode === MapModes.display ? reports
    .filter(report => !!report.location && !!report.location.lat)
    .map(({ location, message, id }) => ({
      id,
      position: L.latLng(location.lat, location.lon),
      message,
    })) : []

  return (
    <MapContainer>
      { }
      <Map
        markers={markers}
      />
    </MapContainer>
  )
}
