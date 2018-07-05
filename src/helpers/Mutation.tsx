import * as React from 'react'
import { Mutation as ApolloMutation } from 'react-apollo'
import get from 'lodash/get'
import { observer } from 'mobx-react'
import { AnyFunction } from '../types/AnyFunction'

type Props = {
  onCompleted?: any
  mutation: any
  update?: AnyFunction
  component: any
  variables?: object
  refetchQueries?: any[]
}

export const Mutation = observer(
  ({
    mutation,
    update,
    component: Component,
    variables,
    refetchQueries,
    onCompleted,
    ...rest
  }: Props) => (
    <ApolloMutation
      refetchQueries={refetchQueries}
      onCompleted={onCompleted}
      mutation={mutation}
      update={update}
      variables={variables}>
      {(mutate, { loading, error, data = {} }): React.ReactNode => {
        const queryName = Object.keys(data)[0]
        const mutationResult = get(data, queryName, data)

        return (
          <Component
            onCompleted={onCompleted}
            loading={loading}
            error={error}
            data={mutationResult}
            mutate={mutate}
            {...rest}
          />
        )
      }}
    </ApolloMutation>
  ),
)

type MutateProps = {
  mutation: any
  update?: AnyFunction
}

export const mutate = ({
  mutation: staticMutation,
  update: staticUpdate,
}: MutateProps): Function => Component => ({
  mutation = staticMutation,
  update = staticUpdate,
  ...rest
}: MutateProps) => (
  <Mutation mutation={mutation} update={update} component={Component} {...rest} />
)
