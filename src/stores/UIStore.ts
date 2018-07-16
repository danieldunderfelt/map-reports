import { action, extendObservable } from 'mobx'
import { get } from 'lodash'

const UIStore = router => (state, initialState) => {
  const uiState = extendObservable(state, {
    route: get(initialState, 'route', '/'),
  })

  const setCurrentRoute = action(route => {
    uiState.route = route
  })

  setCurrentRoute(router.get())
  router.listen(setCurrentRoute)

  return {
    setCurrentRoute,
  }
}

export default UIStore
