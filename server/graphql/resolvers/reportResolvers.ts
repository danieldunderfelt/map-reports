import fuzzysearch from 'fuzzysearch'
import { orderBy, get, toLower, groupBy, values, merge } from 'lodash'
import {
  Report,
  ReportItem,
  ReportPriority as ReportPriorityEnum,
  ReportStatus as ReportStatusEnum,
} from '../../../types/Report'
import createCursor from '../../util/createCursor'
import { ManualReportDataInput } from '../../../types/CreateReportData'
import { createReport as reportFactory } from '../../reports/createReport'

const filterableKeys = ['reporter.id', 'reporter.type', 'status', 'priority']

// Get the values that these props should be sorted by.
// Only props listed here use special values, all
// others use the value that is in the object.
const sortValues = {
  reporter: obj => (obj.reporter.type === 'manual' ? 1 : 0),
  status: obj => Object.values(ReportStatusEnum).indexOf(obj.status),
  priority: obj => Object.values(ReportPriorityEnum).indexOf(obj.priority),
}

const reportResolvers = db => {
  const reportsDb = db.table('report')
  const reporterDb = db.table('reporter')

  function applyFilters(reportsToFilter, filterRules) {
    const resolvedReporters = []
    const filterGroups = values(groupBy(filterRules.filter(f => !!f.key), 'key'))

    // Include only reports that match all filters
    return reportsToFilter.filter(report =>
      // make sure that the current report matches every filter group
      filterGroups.every(filterGroup =>
        // Filters are grouped by key. If there are many keys, treat it as an
        // "or" filter such that the report[key] value matches either filter.
        // A single filter in a group is effectively an "and" filter.
        filterGroup.some(filter => {
          let reporter = resolvedReporters.find(rep => rep.id === report.reporter)
          let reportItem = report

          // If the key starts with 'reporter' and we haven't resolved the reporter yet, do it.
          if (get(filter, 'key', '').startsWith('reporter') && !reporter) {
            reporter = reporterDb.get(report.reporter)
            resolvedReporters.push(reporter) // Add to cache for future iterations
          }

          // If the key starts with 'reporter', merge the resolved reporter into the report item.
          if (get(filter, 'key', '').startsWith('reporter')) {
            reportItem = merge({}, reportItem, { reporter })
          }

          // Use fuzzy search to match the filter value and the report[key] value.
          return fuzzysearch(
            toLower(filter.value),
            toLower(get(reportItem, filter.key, ''))
          )
        })
      )
    )
  }

  function applySorting(reportsToSort, sortRules) {
    return orderBy<Report>(
      reportsToSort,
      value => {
        const getSortValue = get(sortValues, sortRules.key, obj => obj[sortRules.key])
        return getSortValue(value)
      },
      sortRules.direction
    )
  }

  function allReports() {
    return reportsDb.get()
  }

  function reportsConnection(_, { perPage = 10, cursor = '', sort, filter }) {
    const reports = reportsDb.get()
    // Filter first, then sort.
    const requestedReports = applySorting(applyFilters(reports, filter), sort)

    const reportEdges = requestedReports.map(report => ({
      node: report,
      cursor: createCursor(report, { sort, filter }),
    }))

    const sliceStart = reportEdges.findIndex(edge => edge.cursor === cursor) + 1
    const sliceEnd = sliceStart + perPage
    const totalItems = requestedReports.length
    const totalPages = !totalItems ? 0 : Math.ceil(perPage / totalItems)

    return {
      edges: reportEdges.slice(sliceStart, sliceEnd),
      pageInfo: {
        currentPage: Math.ceil(sliceStart / perPage),
        hasNextPage: sliceEnd < totalItems,
        hasPreviousPage: sliceEnd > perPage,
        totalPages,
      },
    }
  }

  function reportFilterOptions() {
    const reports = allReports()
    const options = []
    const resolvedReporters = []

    reports.forEach(report => {
      filterableKeys.forEach((key: string) => {
        let opt = options.find(o => o.key === key)

        if (!opt) {
          // Create new options/key pair of none existed
          opt = { key, options: [] }
          options.push(opt) // Add it for future iterations
        }

        let reportItem = report
        // Is there an already-resolved reporter in the cache?
        let reporter = resolvedReporters.find(rep => rep.id === report.reporter)

        // If the key starts with 'reporter' and we haven't resolved the reporter yet, do it.
        if (key.startsWith('reporter') && !reporter) {
          reporter = reporterDb.get(report.reporter)
          resolvedReporters.push(reporter) // Add to cache for future iterations
        }

        // If the key starts with 'reporter', merge the resolved reporter into the report item.
        if (key.startsWith('reporter')) {
          reportItem = merge({}, reportItem, { reporter })
        }

        // Get the value behind the key from the report item.
        const value = get(reportItem, key, '')

        // If the value exists on this item AND has not yet been added to the options, add it.
        if (value && opt.options.indexOf(value) === -1) {
          opt.options.push(value)
        }
      })
    })

    return options
  }

  function createReport(
    _,
    {
      reportData,
      reportItem,
    }: {
      reportData: ManualReportDataInput
      reportItem: ReportItem
    }
  ): Report {
    const report = reportFactory({
      ...reportData,
      reporter: 'reporter_0' // TODO: add user id when we have users
    }, reportItem)

    reportsDb.add(report)

    return report
  }

  function removeReport(_, { reportId }): boolean {
    return reportsDb.remove(reportId) > 0
  }

  function setStatus(_, { reportId, newStatus }): Report {
    return reportsDb.update(reportId, { status: newStatus })
  }

  function setPriority(_, { reportId, newPriority }): Report {
    return reportsDb.update(reportId, { priority: newPriority })
  }

  function resolveReportItemType(obj) {
    if (obj.stopCode) {
      return 'StopReportItem'
    }

    return 'ReportItem'
  }

  return {
    reportsConnection,
    allReports,
    reportFilterOptions,
    createReport,
    setStatus,
    setPriority,
    resolveReportItemType,
    removeReport,
  }
}

export default reportResolvers
