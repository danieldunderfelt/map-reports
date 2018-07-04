import React from 'react'
import { Mutation as ApolloMutation } from 'react-apollo'
import get from 'lodash/get'
import { observer } from 'mobx-react'

export const Mutation = observer(
  ({
    mutation,
    update,
    component: Component,
    history = null,
    completedRoute = '',
    variables,
    refetchQueries,
    onCompleted = () => {
      if (history && completedRoute) {
        history.push(completedRoute)
      }
    },
    ...rest
  }) => (
    <ApolloMutation
      refetchQueries={refetchQueries}
      onCompleted={onCompleted}
      mutation={mutation}
      update={update}
      variables={variables}>
      {(mutate, { loading, error, data = {} }) => {
        const queryName = Object.keys(data)[0]
        const mutationResult = get(data, queryName, data)

        return (
          <Component
            onCompleted={onCompleted}
            mutationLoading={loading}
            error={error}
            result={mutationResult}
            mutate={mutate}
            {...rest}
          />
        )
      }}
    </ApolloMutation>
  ),
)

export const mutate = ({
  mutation: staticMutation,
  update: staticUpdate,
}) => Component => ({
  mutation = staticMutation,
  update = staticUpdate,
  ...rest
}) => (
  <Mutation mutation={mutation} update={update} component={Component} {...rest} />
)
