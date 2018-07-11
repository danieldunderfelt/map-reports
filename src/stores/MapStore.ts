import { action, extendObservable } from 'mobx'
import routes from '../routes'
import { Location } from '../../types/Location'
import { LatLngExpression } from 'leaflet'

export const enum MapModes {
  pick = 'pick',
  display = 'display',
}

const defaultMapLocation: LatLngExpression = [60.1689784, 24.9230033]
const defaultMapZoom = 13

const MapStore = (state, utils) => {
  const mapState = extendObservable(state, {
    lastClickedLocation: null,
    mapLocation: defaultMapLocation,
    mapZoom: defaultMapZoom,
    get mapMode() {
      return mapState.route === routes.CREATE_REPORT
        ? MapModes.pick
        : MapModes.display
    },
  })

  const setClickedLocation = action((location: Location) => {
    mapState.lastClickedLocation = location
  })

  const setMapLocation = action((location: LatLngExpression) => {
    mapState.mapLocation = location
  })

  const setMapZoom = action((zoom: number) => {
    mapState.mapZoom = zoom
  })

  return {
    setClickedLocation,
    setMapLocation,
    setMapZoom,
  }
}

export default MapStore
