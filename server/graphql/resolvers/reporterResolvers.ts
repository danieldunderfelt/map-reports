const reporterResolvers = (db) => {
  const reporterDb = db.table('reporter')

  function allReporters() {
    return reporterDb.get()
  }

  function resolveReportReporter(report) {
    const reporters = allReporters()
    return reporters.find(rep => rep.id === report.reporter) || 'NO REPORTER'
  }

  return {
    allReporters,
    resolveReportReporter,
  }
}

export default reporterResolvers
