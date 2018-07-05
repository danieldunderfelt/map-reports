import { get } from 'lodash'

export const updateQuery = (query, queryName = null) => (store, { data }) => {
  const queryProp = queryName || get(query, 'definitions[0].selectionSet.selections[0].name.value', null)
  const operationName = Object.keys(data)[0]
  const operationResult = get(data, operationName, null)

  if(operationResult && queryProp) {
    const cachedData = store.readQuery({ query })
    cachedData[queryProp].push(operationResult)
    store.writeQuery({ query, data: cachedData })
  }
}
