import * as React from 'react'
import { Query as ApolloQuery } from 'react-apollo'
import { createPaginator } from './paginate'
import { has, get } from 'lodash'
import { observer } from 'mobx-react'
import { AnyFunction } from '../../types/AnyFunction'
import { FetchPolicy } from 'apollo-client'

export const Query = observer(
  ({
    showWhileLoading = true,
    query: queryProp,
    variables,
    component: Component,
    paginate = true,
    pollInterval = 0,
    fetchPolicy = 'cache-first',
    ...rest
  }: {
    query: any
    component: any
    variables?: object
    showWhileLoading?: boolean
    paginate?: boolean
    pollInterval?: number
    fetchPolicy?: FetchPolicy
  }) => {
    return (
      <ApolloQuery
        variables={variables}
        query={queryProp}
        pollInterval={pollInterval}
        fetchPolicy={fetchPolicy}>
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
    )
  }
)

export const query = ({
  query: staticQuery,
  pollInterval: staticInterval = 0,
  getVariables = () => null,
  fetchPolicy,
}: {
  query: any
  pollInterval?: number
  getVariables?: AnyFunction
  fetchPolicy?: FetchPolicy
}): Function => Component =>
  observer(
    ({ query: queryProp = staticQuery, pollInterval = staticInterval, ...rest }) => {
      const { variables = getVariables(rest) } = rest

      return (
        <Query
          query={queryProp}
          component={Component}
          pollInterval={pollInterval}
          fetchPolicy={fetchPolicy}
          {...rest}
          variables={variables}
        />
      )
    }
  )
