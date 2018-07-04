import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { mutate } from '../helpers/Mutation'
import { observable } from 'mobx'
import gql from 'graphql-tag'
import { ReportFragment } from '../fragments/ReportFragment'

const createReportMutation = gql`
  mutation createReport($title: String, $body: String) {
    createReport(title: $title, body: $body) {
      ...ReportFields
    }
  }
  ${ReportFragment}
`

@mutate({ mutation: createReportMutation })
@observer
class SubmitReport extends Component {
  @observable
  report = {
    title: '',
    body: '',
  }

  onChange = which => e => {
    this.report[which] = e.target.value
  }

  onSubmit = e => {
    e.preventDefault()

    const { mutate } = this.props
    const { title, body } = this.report

    mutate({
      variables: {
        title,
        body,
      },
    })
  }

  render() {
    const { title, body } = this.report

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
            <textarea value={body} onChange={this.onChange('body')} />
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
