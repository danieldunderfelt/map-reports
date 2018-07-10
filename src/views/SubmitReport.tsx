import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { mutate } from '../helpers/Mutation'
import { action, observable, toJS } from 'mobx'
import gql from 'graphql-tag'
import { ReportFragment } from '../fragments/ReportFragment'
import { AnyFunction } from '../../types/AnyFunction'
import { reportsQuery } from '../queries/reportsQuery'
import { updateQuery } from '../helpers/updateQuery'
import { Report } from '../../types/Report'
import { RouterType } from 'pathricia'
import routes from '../routes'

const createReportMutation = gql`
  mutation createReport($reportData: CreateReport) {
    createReport(reportData: $reportData) {
      ...ReportFields
    }
  }
  ${ReportFragment}
`

type Props = {
  mutate?: AnyFunction
  state?: {
    lastClickedLocation?: Location
    reportDraft: Report
  }
  router?: RouterType
  actions?: {
    Map?: any
    Report?: {
      createReport: () => void
    }
  }
}

@mutate({ mutation: createReportMutation, update: updateQuery(reportsQuery) })
@inject('state', 'actions', 'router')
@observer
class SubmitReport extends React.Component<Props, any> {
  componentDidMount() {
    const { Report, Map } = this.props.actions
    Report.createReport()
    Map.setClickedLocation(null)
  }

  pickCurrentLocation = () => {
    const { Map } = this.props.actions

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      Map.setClickedLocation({ lat: coords.latitude, lon: coords.longitude })
    })
  }

  onChange = which =>
    action((e: React.ChangeEvent<any>) => {
      this.props.state.reportDraft[which] = e.target.value
    })

  onSubmit = e => {
    e.preventDefault()

    const { mutate, state, router } = this.props
    const { title, message } = state.reportDraft
    const location = state.lastClickedLocation

    mutate({
      variables: {
        reportData: {
          title,
          message,
          item: {
            type: 'general',
            location,
          },
          reporter: 'reporter_0',
        },
      },
    })

    router.go(routes.REPORTS)
  }

  render() {
    const { state } = this.props
    const { title, message } = state.reportDraft
    const location = state.lastClickedLocation

    return (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <legend>Create report</legend>
          <p>
            <label>Title</label>
            <br />
            <input value={title} onChange={this.onChange('title')} />
          </p>
          <p>
            <label>Body</label>
            <br />
            <textarea value={message} onChange={this.onChange('message')} />
          </p>
          <p>
            Location: <code>{JSON.stringify(toJS(location))}</code>
            <br />
            <button type="button" onClick={this.pickCurrentLocation}>Use current location</button>
          </p>
          <p>
            <button type="submit">Send</button>
          </p>
        </fieldset>
      </form>
    )
  }
}

export default SubmitReport
