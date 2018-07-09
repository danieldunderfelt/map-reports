import { action, extendObservable } from 'mobx'

const emptyReport = {
  title: '',
  message: '',
}

const ReportStore = state => {
  const reportState = extendObservable(state, {
    reportDraft: emptyReport,
    sortReports: { key: 'createdAt', direction: 'desc' },
    filterReports: { key: '', value: '' },
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

  const filterReports = action((key, value) => {
    reportState.filterReports.key = key
    reportState.filterReports.value = value
  })

  return {
    createReport,
    sortReports,
    filterReports,
  }
}

export default ReportStore
