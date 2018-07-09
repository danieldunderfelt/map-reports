import * as React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { app } from 'mobx-app'
import { uniq, get } from 'lodash'
import { Report } from '../../types/Report'
import Select from '../helpers/Select'

const SortButton = styled.button<{ active: boolean }>`
  background: 0;
  border: 0;
  padding: 0;
  color: blue;
  cursor: pointer;
  width: 4.5rem;
  text-align: center;
  outline: 0;
  font-weight: ${({ active = false }) => (active ? 'bold' : 'normal')};
`

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  margin: 0.5rem;
  border: 1px solid #eee;
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

const filterLabels = {
  title: 'Otsikko',
  message: 'Viesti',
  'reporter.id': 'Ilmoittaja',
  'reporter.type': 'Ilmoittajan tyyppi',
  status: 'Vaihe',
  priority: 'Tärkeys',
  createdAt: 'Luontipäivämäärä',
  updatedAt: 'Viimeksi päivitetty',
  asc: 'Nouseva',
  desc: 'Laskeva',
}

type FilterType = {
  key: string
  value: string
}

interface Props {
  reports: Report[]
  state?: {
    sortReports: {
      key: string
      direction: string
    }
    filterReports: FilterType[]
  }
  Report?: {
    sortReports: (key: string, direction: string) => void
    addReportsFilter: (key?: string, value?: string) => void
    setFilterValues: (filterIndex: number, key?: string, value?: string) => void
    removeFilter: (filterIndex: number) => FilterType
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

  getFilterKeys = () =>
    Object.keys(filterableKeys)
      .filter(key => this.getFilterOptions(key).length > 1)
      .map(filterKey => ({
        value: filterKey,
        label: get(filterLabels, filterKey, filterKey),
      }))

  renderFilterItem = (filterItem: { key: string; value: string }, index) => {
    const { Report } = this.props
    const keyOptions = this.getFilterKeys()
    const filterType = filterableKeys[filterItem.key]

    return (
      <FilterItem key={`report_filter_${filterItem.key}_${index}`}>
        <Select
          name={`filter_key_${filterItem.key}_select`}
          onChange={e => Report.setFilterValues(index, e.target.value)}
          options={[{ value: '', label: 'Valitse suodatin' }, ...keyOptions]}
          value={filterItem.key}
        />
        {filterType === 'search' ? (
          <input
            type="text"
            value={filterItem.value}
            onChange={e =>
              Report.setFilterValues(index, filterItem.key, e.target.value)
            }
          />
        ) : (
          <Select
            name={`filter_options_${filterItem.key}_select`}
            options={this.getFilterOptions(filterItem.key)}
            value={filterItem.value}
            onChange={e =>
              Report.setFilterValues(index, filterItem.key, e.target.value)
            }
          />
        )}
        <button onClick={() => Report.removeFilter(index)}>-</button>
      </FilterItem>
    )
  }

  render() {
    const { state, Report } = this.props
    const { filterReports, sortReports } = state

    return (
      <div>
        <div>
          <Select
            name="sort_reports"
            options={sortableKeys.map(sortKey => ({
              value: sortKey,
              label: get(filterLabels, sortKey, sortKey),
            }))}
            onChange={this.onChangeSortKey}
            value={sortReports.key}
          />
          <SortButton
            active={sortReports.direction === 'asc'}
            type="button"
            onClick={this.onChangeSortDirection('asc')}>
            {get(filterLabels, 'asc', 'asc')}
          </SortButton>{' '}
          /{' '}
          <SortButton
            active={sortReports.direction === 'desc'}
            type="button"
            onClick={this.onChangeSortDirection('desc')}>
            {get(filterLabels, 'desc', 'desc')}
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
