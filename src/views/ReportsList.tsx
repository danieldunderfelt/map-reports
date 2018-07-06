import * as React from 'react'
import { observer } from 'mobx-react'
import { AnyFunction } from '../../types/AnyFunction'
import { reportsQuery } from '../queries/reportsQuery'
import { computed, observable, action } from 'mobx'
import styled from 'styled-components'
import { orderBy, get } from 'lodash'
import { query } from '../helpers/Query'
import {
  ReportPriority as ReportPriorityEnum,
  ReportStatus as ReportStatusEnum,
} from '../../types/Report'
import ReportStatus from '../components/ReportStatus'
import ReportPriority from '../components/ReportPriority'

type Props = {
  startPolling?: AnyFunction
  stopPolling?: AnyFunction
  queryData?: any
}

const SortItem = styled.span<{ active: Boolean }>`
  margin-right: 1rem;
  padding: 0.5rem;
  border: 1px solid ${({ active = false }) => (active ? '#ccc' : '#efefef')};
  background: ${({ active = false }) => (active ? '#efefef' : 'transparent')};
  font-family: monospace;
  display: inline-block;
  margin-bottom: 0.5rem;

  > span {
    font-weight: ${({ active = false }) => (active ? 'bold' : 'normal')};
  }
`

const SortButton = styled.button<{ active: boolean }>`
  background: 0;
  border: 0;
  padding: 0;
  color: blue;
  cursor: pointer;
  width: 1.75rem;
  text-align: center;
  outline: 0;
  font-weight: ${({ active = false }) => (active ? 'bold' : 'normal')};
`

const sortableKeys = [
  'title',
  'reporter',
  'status',
  'priority',
  'createdAt',
  'updatedAt',
]

const filterableKeys = ['title', 'reporter', 'status', 'priority']

const sortValues = {
  reporter: obj => (obj.reporter.type === 'manual' ? 1 : 0),
  status: obj => Object.values(ReportStatusEnum).indexOf(obj.status),
  priority: obj => Object.values(ReportPriorityEnum).indexOf(obj.priority),
}

@query({ query: reportsQuery })
@observer
class ReportsList extends React.Component<Props, any> {
  @observable
  listSettings = {
    sortBy: { key: 'createdAt', direction: 'desc' },
    filter: { key: '', value: '' },
  }

  @computed
  get reports() {
    const reports = get(this, 'props.queryData.reports', [])
    const { sortBy } = this.listSettings

    return orderBy(
      reports,
      value => {
        const getSortValue = get(sortValues, sortBy.key, obj => obj[sortBy.key])
        return getSortValue(value)
      },
      sortBy.direction,
    )
  }

  onSort = (key, direction) =>
    action((e: React.SyntheticEvent<any>) => {
      e.preventDefault()
      this.listSettings.sortBy.key = key
      this.listSettings.sortBy.direction = direction
    })

  onFilter = e => {}

  render() {
    const { reports, listSettings } = this
    const { sortBy } = listSettings

    return (
      <div>
        <div>
          <div>
            {sortableKeys.map((key, idx) => (
              <SortItem active={sortBy.key === key} key={`sort_${key}_${idx}`}>
                <span>{key}</span>{' '}
                <SortButton
                  active={sortBy.key === key && sortBy.direction === 'asc'}
                  type="button"
                  onClick={this.onSort(key, 'asc')}>
                  asc
                </SortButton>{' '}
                /{' '}
                <SortButton
                  active={sortBy.key === key && sortBy.direction === 'desc'}
                  type="button"
                  onClick={this.onSort(key, 'desc')}>
                  desc
                </SortButton>
              </SortItem>
            ))}
          </div>
        </div>
        {reports.map(report => (
          <React.Fragment key={report.id}>
            <div>
              <h2>{report.title}</h2>
              <p>{report.message}</p>
              <h4>Reported by: {report.reporter.name}</h4>
              <p>
                <ReportStatus report={report} readOnly={false} />
                <br />
                <ReportPriority report={report} readOnly={false} />
              </p>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    )
  }
}

export default ReportsList
