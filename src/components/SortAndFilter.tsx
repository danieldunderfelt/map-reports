import * as React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { app } from 'mobx-app'
import { uniq, get } from 'lodash'
import { Report } from '../../types/Report'

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

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const sortableKeys = [
  'title',
  'reporter',
  'status',
  'priority',
  'createdAt',
  'updatedAt',
]

const filterableKeys = {
  title: 'search',
  message: 'search',
  'reporter.id': 'values',
  'reporter.type': 'values',
  status: 'values',
  priority: 'values',
}

interface Props {
  reports: Report[]
  state?: {
    sortReports: {
      key: string
      direction: string
    }
    filterReports: {
      key: string
      value: string
    }[]
  }
  Report?: {
    sortReports: (key: string, direction: string) => void
    addReportsFilter: (key?: string, value?: string) => void
    setFilterValues: (filterIndex: number, key?: string, value?: string) => void
  }
}

@inject(app('Report'))
@observer
class SortAndFilter extends React.Component<Props, any> {
  onChangeSortKey = (e: React.ChangeEvent) => {
    const {
      Report,
      state: { sortReports },
    } = this.props
    // @ts-ignore
    const key = e.target.value
    Report.sortReports(key, sortReports.direction)
  }

  onChangeSortDirection = (setDirection: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    const {
      Report,
      state: { sortReports },
    } = this.props
    Report.sortReports(sortReports.key, setDirection)
  }

  addFilter = () => {
    const { Report } = this.props
    Report.addReportsFilter() // Add an empty filter
  }

  getFilterOptions = (key: string) => {
    const { reports = [] } = this.props

    const options = reports
      .map(report => get(report, key))
      .filter(optionValue => !!optionValue)

    return uniq(options)
  }

  getFilterKeys = () => {
    const { state } = this.props

    return Object.keys(filterableKeys).filter(
      key => state.filterReports.find(filter => filter.key === key) !== null,
    )
  }

  renderFilterItem = (filterItem: { key: string; value: string }, index) => {
    const { Report } = this.props
    const keyOptions = this.getFilterKeys()
    const filterType = filterableKeys[filterItem.key]

    return (
      <FilterItem key={`report_filter_${filterItem.key}_${index}`}>
        <select
          value={filterItem.key}
          onChange={e => Report.setFilterValues(index, e.target.value)}>
          <option value="">
            Choose filter...
          </option>
          {keyOptions.map(key => (
            <option value={key} key={`filter_key_option_${key}`}>
              {key}
            </option>
          ))}
        </select>
        { filterType === 'search' ? (
          <input
            type="text"
            value={filterItem.value}
            onChange={e =>
              Report.setFilterValues(index, filterItem.key, e.target.value)
            }
          />
        ) : (
          <select
            value={filterItem.value}
            onChange={e => Report.setFilterValues(index, filterItem.key, e.target.value)}>
            {this.getFilterOptions(filterItem.key).map(value => (
              <option value={value} key={`filter_value_option_${value}`}>
                {value}
              </option>
            ))}
          </select>
        )}
      </FilterItem>
    )
  }

  render() {
    const { state, Report } = this.props
    const { filterReports, sortReports } = state

    return (
      <div>
        <div>
          <select onChange={this.onChangeSortKey} value={sortReports.key}>
            {sortableKeys.map((key, idx) => (
              <option key={`sort_${key}_${idx}`} value={key}>
                {key}
              </option>
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
        <div>
          {filterReports.map(this.renderFilterItem)}
          <button onClick={() => Report.addReportsFilter()}>Add filter</button>
        </div>
      </div>
    )
  }
}

export default SortAndFilter
