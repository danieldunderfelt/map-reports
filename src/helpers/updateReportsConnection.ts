import { get } from 'lodash'
import { emptyArguments, reportsQuery } from '../queries/reportsQuery'

const updateReportsConnection = (store, { data }) => {
  const queryProp = 'reportsConnection'
  const operationName = Object.keys(data)[0]
  const operationResult = get(data, operationName, null)

  if (operationResult) {
    const variables = emptyArguments
    const query = reportsQuery

    const resultData = {
      cursor: window.btoa(
        JSON.stringify({
          id: operationResult.id,
          filter: variables.filter,
          sort: variables.sort,
        })
      ),
      node: operationResult,
      __typename: 'ReportsEdge'
    }

    let cachedData

    try {
      cachedData = store.readQuery({ query, variables })
    } catch (e) {
      console.log(e)
    }

    cachedData[queryProp].edges.unshift(resultData)
    store.writeQuery({ query, variables, data: cachedData })
  }
}

export default updateReportsConnection
