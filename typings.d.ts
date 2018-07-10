declare module '*.png' {
  const content: string
  export default content
}

declare module '*.json' {
  const value: any
  export default value
}

declare module 'pathricia' {
  export type RouterType = {
    go: (toRoute: string, replace?: boolean) => string
    get: () => string
    back: () => void
    forward: () => void
    isActive: (route: string) => boolean
    listen: (listener: (...args: any[]) => any) => () => void
  }

  export function Router(index?: string, history?: History): RouterType
}

declare module 'mobx-app' {
  import { IObservableArray, IObservableObject } from 'mobx'
  import { IStoresToProps } from 'mobx-react'

  interface StateActions {
    state: IObservableObject
    actions: any
  }

  type AnyFunction = (...args: any[]) => any

  export function createStore(stores: object, initialData?: object): StateActions

  export function app(
    ...keys: string[]
  ): IStoresToProps<{ state: IObservableObject } | StateActions>

  export function collection(
    collection: IObservableObject | IObservableArray,
    factoryOrName: string | AnyFunction,
    optName: string,
  )
}
