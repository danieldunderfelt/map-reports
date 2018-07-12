import { get } from 'lodash'
import { AnyFunction } from '../../types/AnyFunction'

export function createPaginator(
  data,
  name,
  fetchMore
): (perPage?: number) => AnyFunction | null {
  if (!get(data, 'pageInfo.hasNextPage')) {
    return null
  }

  return (perPage = 10) => {
    const cursor = get(data, `edges[${data.edges.length - 1}].cursor`, '')

    return fetchMore({
      variables: {
        perPage,
        cursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = get(fetchMoreResult, `${name}.edges`, [])
        const pageInfo = get(fetchMoreResult, `${name}.pageInfo`)

        return newEdges.length
          ? {
              // Put the new data at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              [name]: {
                __typename: get(previousResult, `${name}.__typename`),
                edges: [...get(previousResult, `${name}.edges`, []), ...newEdges],
                pageInfo,
              },
            }
          : previousResult
      },
    })
  }
}
