import * as React from 'react'
import styled from 'styled-components'
import ReportStatus from '../components/ReportStatus'
import ReportPriority from '../components/ReportPriority'
import { Report } from '../../types/Report'
import { AnyFunction } from '../../types/AnyFunction'
import {rgba} from 'polished'

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
  justify-content: space-between;
  align-content: center;
  margin-top: 1rem;

  > * {
    margin: 0;
    margin: 0 0.5em;
    padding: 0 1em 0 0;
    border-right: 1px solid #ccc;

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

type Props = {
  report: Report
  onClick: AnyFunction
}

export default ({ report, onClick }: Props) => (
  <Report type={ report.item.type } onClick={onClick}>
    {console.log()}
    <ReportHeading>
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
  </Report>
)
