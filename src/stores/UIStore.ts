import { action, extendObservable } from 'mobx'

const UIStore = (state, utils) => {
  const uiState = extendObservable(state, {
    route: '/',
  })

  const setCurrentRoute = action(route => {
    uiState.route = route
  })

  utils.router.listen(setCurrentRoute)

  return {
    setCurrentRoute,
  }
}

export default UIStore
