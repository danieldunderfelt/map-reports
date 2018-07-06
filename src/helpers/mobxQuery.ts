import { observable } from 'mobx'
import { fromResource } from 'mobx-utils'
import apolloClient from './graphqlClient'

export function mobxQuery(query) {
  const queryObservable = apolloClient.watchQuery({ query })
  let subscription

  return fromResource(
    // MobX starts using the observable
    sink => {
      subscription = queryObservable.subscribe({
        next: ({ data }) => {
          console.log(data)

          if(data) {
            sink(observable(data))
          }
        },
        error: error => {
          console.log('there was an error sending the query', error)
        },
      })
    },
    () => subscription.unsubscribe(),
  )
}
