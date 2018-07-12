import { Report } from '../types/Report'
import { ReporterMeta } from '../types/Reporter'
import { get, merge } from 'lodash'

const createDb = (collection: any[], name = 'Item') => {
  function get(id: string = null) {
    if(id) {
      return collection.find(item => item.id === id)
    }

    return collection
  }

  function add(item) {
    collection.push(item)
  }

  function update(id, newValues) {
    const item = collection.find(item => item.id === id)

    if (!item) {
      throw new Error(`${name} with ID ${id} not found.`)
    }

    return merge(item, newValues)
  }

  return {
    get,
    add,
    update
  }
}

const reportsDb = () => {
  const reports: Report[] = []
  return createDb(reports, 'Report')
}

const reportersDb = () => {
  const reporters: ReporterMeta[] = [
    {
      id: 'reporter_0',
      name: 'anonuser',
      type: 'manual',
    },
  ]

  return createDb(reporters, 'Reporter')
}

const database = () => {
  const tables = {
    report: reportsDb(),
    reporter: reportersDb(),
  }

  function table(tableName) {
    return get(tables, tableName)
  }

  return {
    table
  }
}

export default database
