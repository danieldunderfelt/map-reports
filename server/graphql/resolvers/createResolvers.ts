import reportResolvers from './reportResolvers'
import reporterResolvers from './reporterResolvers'

const createResolvers = (db): any => {
  const reports = reportResolvers(db)
  const reporters = reporterResolvers(db)

  return {
    Query: {
      // Reports
      reports: reports.allReports,
      reportFilterOptions: reports.reportFilterOptions,
      reportsConnection: reports.reportsConnection,

      // Reporters
      reporters: reporters.allReporters,

      // datasets
      datasets: () => db.table('datasets').get(),
      dataset: (_, { id }) => db.table('datasets').get(id)
    },
    Mutation: {
      // Reports
      createReport: reports.createReport,
      removeReport: reports.removeReport,
      setStatus: reports.setStatus,
      setPriority: reports.setPriority,
    },
    ReportItemType: {
      __resolveType: reports.resolveReportItemType,
    },
    Report: {
      reporter: reporters.resolveReportReporter,
    },
  }
}

export default createResolvers
