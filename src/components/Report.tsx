import * as React from 'react'
import styled from 'styled-components'
import ReportStatus from '../components/ReportStatus'
import ReportPriority from '../components/ReportPriority'
import { Report } from '../../types/Report'
import { AnyFunction } from '../../types/AnyFunction'
import { rgba } from 'polished'
import { get } from 'lodash'
import { SlideDown } from 'react-slidedown'
import * as prettyJson from 'prettyjson'
import 'react-slidedown/lib/slidedown.css'

const Report = styled.div<{ type: string }>`
  cursor: pointer;
  padding: 1rem;
  border-bottom: 1px solid #efefef;
  background: ${({ type = 'general' }) => {
    switch (type) {
      case 'stop':
        return rgba('darkorchid', 0.2)
      case 'general':
      default:
        return rgba('#55aaff', 0.2)
    }
  }};
`

const ReportHeading = styled.header`
  > h2 {
    font-size: 1em;
    margin-top: 0;
    margin-bottom: 0;
  }
`

const ReportBody = styled.article`
  font-size: 0.8em;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  margin-top: 1rem;

  > * {
    margin: 0;
    margin: 0 0.5em;
    padding: 0 1em 0 0;
    border-right: 1px solid #ccc;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    &:first-child {
      margin-left: 0;
      padding-left: 0;
    }

    &:last-child {
      border-right: 0;
      padding-right: 0;
    }
  }
`

const ReportContent = styled.div<{ json?: boolean }>`
  padding: 1rem 0 0;
  
  ${({ json = false }) => json ? `
    white-space: pre-line;
  ` : ''}
`

type Props = {
  report: Report
  onClick: AnyFunction
}

class ReportItem extends React.Component<Props, any> {

  state = {
    isOpen: false
  }

  onHeadingClick = e => {
    e.preventDefault()

    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    const { report, onClick } = this.props

    return (
      <Report type={report.item.type} onClick={onClick}>
        <ReportHeading onClick={this.onHeadingClick}>
          <h2>{report.title}</h2>
        </ReportHeading>
        <ReportBody>
          <h4>
            {typeof report.reporter === 'string' ? report.reporter : report.reporter.name}
          </h4>
          <div>
            <ReportStatus report={report} readOnly={false} />
          </div>
          <div>
            <ReportPriority report={report} readOnly={false} />
          </div>
        </ReportBody>
        <SlideDown closed={!this.state.isOpen}>
          {report.message && (
            <ReportContent>
              {report.message}
            </ReportContent>
          )}
          {get(report, 'item.feature', '') && (
            <ReportContent json>
              {prettyJson.render(JSON.parse(get(report, 'item.feature', '{}')).properties)}
            </ReportContent>
          )}
        </SlideDown>
      </Report>
    )
  }
}

export default ReportItem
