import { action, extendObservable } from 'mobx'

const emptyReport = {
  title: '',
  message: '',
}

const ReportStore = state => {
  const reportState = extendObservable(state, {
    reportDraft: emptyReport,
    sortReports: { key: 'createdAt', direction: 'desc' },
    filterReports: [{ key: '', value: '' }],
  })

  const createReport = action(() => {
    reportState.reportDraft = emptyReport
  })

  const sortReports = action(
    (
      key = reportState.sortReports.key,
      direction = reportState.sortReports.direction,
    ) => {
      reportState.sortReports.key = key
      reportState.sortReports.direction = direction
    },
  )

  const addReportsFilter = action((key = '', value = '') => {
    const filterTerm = { key, value }
    reportState.filterReports.push(filterTerm)
  })

  const setFilterValues = action(
    (filterIndex: number, key?: string, value: string = '') => {
      const filter = reportState.filterReports[filterIndex]

      if (filter) {
        filter.key = key ? key : filter.key
        filter.value = value
      }
    },
  )

  const removeFilter = action((index: number) => reportState.filterReports.splice(index, 1))

  return {
    createReport,
    sortReports,
    addReportsFilter,
    setFilterValues,
    removeFilter,
  }
}

export default ReportStore
