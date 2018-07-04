import React from 'react'
import { Query as ApolloQuery } from 'react-apollo'
import { createPaginator } from './paginate'
import has from 'lodash/has'
import get from 'lodash/get'
import { observer } from 'mobx-react'

export const Query = observer(
  ({
    showWhileLoading = false,
    query: queryProp,
    variables,
    component: Component,
    paginate = true,
    pollInterval = 0,
    ...rest
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
            error={error}
            fetchMore={paginate ? paginator : false}
            data={{ ...get(rest, 'queryResult', {}), ...data }}
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
}) => Component => ({
  query: queryProp = staticQuery,
  variables = getVariables(rest),
  pollInterval = staticInterval,
  ...rest
}) => {
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
