import * as React from 'react'
import { divIcon, point } from 'leaflet'
import 'react-leaflet-markercluster/dist/styles.min.css'
import MarkerClusterGroup from 'react-leaflet-markercluster'

export default ({ children }) => (
  <MarkerClusterGroup
    showCoverageOnHover={false}
    iconCreateFunction={cluster => {
      const count = cluster.getChildCount()

      return divIcon({
        html: `<span class="marker-cluster-icon" style="--count: ${Math.min(count, 20)}">${count}</span>`,
        className: 'marker-cluster',
        iconSize: point(40, 40, true),
      })
    }}>
    { children }
  </MarkerClusterGroup>
)
