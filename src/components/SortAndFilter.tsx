import * as React from 'react'
import { action } from 'mobx'
import styled from 'styled-components'
import { ReportPriority as ReportPriorityEnum, ReportStatus as ReportStatusEnum } from '../../types/Report'
import { inject, observer} from 'mobx-react'
import { app } from 'mobx-app'

const SortItem = styled.span<{ active: boolean }>`
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

interface Props {
  state?: {
    sortReports: {
      key: string
      direction: string
    }
    filterReports: {
      key: string
      value: string
    }
  }
  Report?: {
    sortReports: (key: string, direction: string) => void,
    filterReports: (key: string, value: string) => void,
  }
}

@inject(app('Report'))
@observer
class SortAndFilter extends React.Component<Props, any> {

  onChangeSortKey = (e: React.ChangeEvent) => {
    const { Report, state: {sortReports} }  = this.props
    const key = e.target.value
    Report.sortReports(key, sortReports.direction)
  }

  onChangeSortDirection = (setDirection: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const { Report, state: { sortReports } } = this.props
    Report.sortReports(sortReports.key, setDirection)
  }

  onFilter = e => {}

  render() {
    const { sortReports } = this.props.state

    return (
      <div>
        <div>
          <select onChange={this.onChangeSortKey} value={sortReports.key}>
            {sortableKeys.map((key, idx) => (
              <option key={`sort_${key}_${idx}`} value={key}>{ key }</option>
            ))}
          </select>
          <SortButton
            active={sortReports.direction === 'asc'}
            type="button"
            onClick={this.onChangeSortDirection('asc')}>
            asc
          </SortButton>{' '}
          /{' '}
          <SortButton
            active={sortReports.direction === 'desc'}
            type="button"
            onClick={this.onChangeSortDirection('desc')}>
            desc
          </SortButton>
        </div>
      </div>
    )
  }
}

export default SortAndFilter
