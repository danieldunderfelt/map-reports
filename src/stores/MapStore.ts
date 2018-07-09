import { action, extendObservable } from 'mobx'
import routes from '../routes'
import { LeafletMouseEvent } from 'leaflet'
import { Location } from '../../types/Location'

export const enum MapModes {
  pick = 'pick',
  display = 'display',
}

const MapStore = (state, utils) => {
  const mapState = extendObservable(state, {
    lastClickedLocation: null,
    get mapMode() {
      return mapState.route === routes.CREATE_REPORT
        ? MapModes.pick
        : MapModes.display
    },
  })

  const onMapClick = (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng
    setClickedLocation({ lat, lon: lng })
  }

  const setClickedLocation = action((location: Location) => {
    mapState.lastClickedLocation = location
  })

  return {
    onMapClick,
    setClickedLocation,
  }
}

export default MapStore
