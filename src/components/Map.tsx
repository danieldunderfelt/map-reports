import * as React from 'react'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styled from 'styled-components'

const Root = styled.div<any>`
  width: 100%;
  max-height: 100%;
  overflow: hidden;
`

class Map extends React.Component<any, any> {
  mapRef = React.createRef()
  leaflet = null

  componentDidMount() {
    this.leaflet = this.initializeMap()
  }

  initializeMap() {
    const map = L
      // @ts-ignore
      .map(this.mapRef.current)
      .setView([60.1689784, 24.9230033], 13)

    L.tileLayer(
      'https://digitransit-dev-cdn-origin.azureedge.net/map/v1/hsl-map/{z}/{x}/{y}{retina}.png',
      {
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
        attribution:
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        retina: '@2x',
        baseLayer: true,
      },
    ).addTo(map)

    return map
  }

  render() {
    return <Root innerRef={this.mapRef} />
  }
}

export default Map
