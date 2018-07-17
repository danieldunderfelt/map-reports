import { action, extendObservable } from 'mobx'
import { get } from 'lodash'

const UIStore = router => (state, initialState) => {
  const uiState = extendObservable(state, {
    route: get(initialState, 'route', '/'),
    selectedDataset: '',
  })

  const selectDataset = action(datasetId => {
    uiState.selectedDataset = datasetId
  })

  const setCurrentRoute = action(route => {
    uiState.route = route
  })

  setCurrentRoute(router.get())
  router.listen(setCurrentRoute)

  return {
    setCurrentRoute,
    selectDataset,
  }
}

export default UIStore
