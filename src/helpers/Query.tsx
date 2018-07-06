import * as React from 'react'
import { Query as ApolloQuery } from 'react-apollo'
import { createPaginator } from './paginate'
import { has, get } from 'lodash'
import { observer } from 'mobx-react'
import { AnyFunction } from '../../types/AnyFunction'

export const Query = observer(
  ({
    showWhileLoading = false,
    query: queryProp,
    variables,
    component: Component,
    paginate = true,
    pollInterval = 0,
    ...rest
  }: {
    query: any
    component: any
    variables?: object
    showWhileLoading?: boolean
    paginate?: boolean
    pollInterval?: number
  }) => (
    <ApolloQuery variables={variables} query={queryProp} pollInterval={pollInterval}>
      {({
        loading,
        error,
        data = {},
        fetchMore,
        refetch,
        client,
        startPolling,
        stopPolling,
      }) => {
        if (loading && !showWhileLoading) {
          return 'Loading...'
        }

        const queryName = Object.keys(data)[0]

        const paginator =
          has(data, `${queryName}.edges`) && has(data, `${queryName}.pageInfo`)
            ? createPaginator(data[queryName], queryName, fetchMore)
            : () => {}

        return (
          <Component
            {...rest}
            startPolling={startPolling}
            stopPolling={stopPolling}
            apolloClient={client}
            refetch={refetch}
            queryError={error}
            fetchMore={paginate ? paginator : false}
            queryData={{ ...get(rest, 'queryData', {}), ...data }} // Merges another data prop with this data
          />
        )
      }}
    </ApolloQuery>
  ),
)

export const query = ({
  query: staticQuery,
  pollInterval: staticInterval = 0,
  getVariables = () => null,
}: {
  query: any
  pollInterval?: number
  getVariables?: AnyFunction
}): Function => Component => ({
  query: queryProp = staticQuery,
  pollInterval = staticInterval,
  ...rest
}) => {
  const { variables = getVariables(rest) } = rest

  return (
    <Query
      query={queryProp}
      component={Component}
      pollInterval={pollInterval}
      {...rest}
      variables={variables}
    />
  )
}
