import { action, extendObservable } from 'mobx'
import routes from '../routes'
import { Location } from '../../types/Location'
import { get } from 'lodash'

export const enum MapModes {
  pick = 'pick',
  display = 'display',
}

const MapStore = (state, initialState) => {
  const mapState = extendObservable(state, {
    lastClickedLocation: get(initialState, 'lastClickedLocation', null),
    get mapMode() {
      return mapState.route === routes.CREATE_REPORT
        ? MapModes.pick
        : MapModes.display
    },
  })

  const setClickedLocation = action((location: Location) => {
    mapState.lastClickedLocation = location
  })

  return {
    setClickedLocation,
  }
}

export default MapStore
