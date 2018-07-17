import { Report } from '../types/Report'
import { ReporterMeta } from '../types/Reporter'
import { get as _get, merge } from 'lodash'
import { Dataset } from '../types/Dataset'

interface RecordTypeContract {
  id: string
}

function createDb<RecordType extends RecordTypeContract>(
  collection: RecordType[],
  name = 'Item'
) {
  function get(id: string = null) {
    if (id) {
      return collection.find(item => item.id === id)
    }

    return collection
  }

  function add(item) {
    if (get(_get(item, 'id'))) {
      throw new Error(
        `An item with id ${_get(item, 'id')} already exists in ${name} table.`
      )
    }

    collection.push(item)
    return item
  }

  function update(id, newValues) {
    const item = collection.find(i => i.id === id)

    if (!item) {
      throw new Error(`${name} with ID ${id} not found.`)
    }

    return merge(item, newValues)
  }

  function updateOrAdd(id, item) {
    const dbItem = get(id)

    if (!dbItem) {
      return add(item)
    }

    return merge(dbItem, item)
  }

  function remove(id) {
    const itemIndex = collection.findIndex(i => i.id === id)

    if(itemIndex === -1) {
      return 0
    }

    const deleted = collection.splice(itemIndex, 1)
    return deleted.length
  }

  return {
    get,
    add,
    update,
    updateOrAdd,
    remove
  }
}

const reportsDb = () => {
  const reports: Report[] = []
  return createDb<Report>(reports, 'Report')
}

const reportersDb = () => {
  const reporters: ReporterMeta[] = [
    {
      id: 'reporter_0',
      name: 'anonuser',
      type: 'manual',
    },
  ]

  return createDb<ReporterMeta>(reporters, 'Reporter')
}

const datasetsDb = () => {
  const datasets: Dataset[] = []
  return createDb(datasets, 'Dataset')
}

const database = () => {
  const tables = {
    report: reportsDb(),
    reporter: reportersDb(),
    datasets: datasetsDb(),
  }

  function table(tableName) {
    return _get(tables, tableName)
  }

  function ensureTable<RecordType extends RecordTypeContract>(tableName, itemName) {
    if (tableName in tables === false) {
      tables[tableName] = createDb<RecordType>([], itemName)
    }
  }

  return {
    table,
    ensureTable,
  }
}

export default database
