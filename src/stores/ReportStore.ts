import { action, extendObservable } from 'mobx'

const emptyReport = {
  title: '',
  message: ''
}

const ReportStore = state => {

  const reportState = extendObservable(state, {
    reportDraft: emptyReport
  })

  const createReport = action(() => {
    reportState.reportDraft = emptyReport
  })

  return {
    createReport
  }
}

export default ReportStore
