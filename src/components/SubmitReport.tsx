import * as React from 'react'
import { observer } from 'mobx-react'
import { mutate } from '../helpers/Mutation'
import { observable } from 'mobx'
import gql from 'graphql-tag'
import { ReportFragment } from '../fragments/ReportFragment'
import { AnyFunction } from '../../types/AnyFunction'

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
}

@mutate({ mutation: createReportMutation })
@observer
class SubmitReport extends React.Component<Props, any> {
  @observable
  report = {
    title: '',
    message: '',
  }

  onChange = which => e => {
    this.report[which] = e.target.value
  }

  onSubmit = e => {
    e.preventDefault()

    const { mutate } = this.props
    const { title, message } = this.report

    mutate({
      variables: {
        reportData: {
          title,
          message,
          reporter: 'reporter_0'
        },
      },
    })
  }

  render() {
    const { title, message } = this.report

    return (
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <legend>Create report</legend>
          <div>
            <label>Title</label>
            <br />
            <input value={title} onChange={this.onChange('title')} />
          </div>
          <div>
            <label>Body</label>
            <br />
            <textarea value={message} onChange={this.onChange('message')} />
          </div>
          <div>
            <button type="submit">Send</button>
          </div>
        </fieldset>
      </form>
    )
  }
}

export default SubmitReport
