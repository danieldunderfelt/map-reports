import * as React from 'react'
import styled from 'styled-components'
import { inject, observer } from 'mobx-react'
import { app } from 'mobx-app'
import { uniq, get } from 'lodash'
import { Report } from '../../types/Report'
import Select from '../helpers/Select'
import { ReportActions } from '../../types/ReportActions'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Button } from '@material-ui/core'

const SortButton = styled(Button)`
  width: 4.5rem;
  text-align: center;
  outline: 0;
`

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 1px solid #eee;
`

const sortableKeys = ['title', 'reporter', 'status', 'priority', 'createdAt', 'updatedAt']

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

export const filterOptionsQuery = gql`
  {
    reportFilterOptions {
      key
      options
    }
  }
`

interface Props {
  reports: Report[]
  state?: {
    sortReports: {
      key: string
      direction: string
    }
    filterReports: FilterType[]
  }
  Report?: ReportActions
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

  getFilterOptions = options => (key: string) => {
    return get(options.find(opt => opt.key === key), 'options', [])
  }

  getFilterKeys = () =>
    Object.keys(filterableKeys).map(filterKey => ({
      value: filterKey,
      label: get(filterLabels, filterKey, filterKey),
    }))

  renderFilterItem = (
    filterItem: { key: string; value: string },
    index,
    filterOptions
  ) => {
    const { Report } = this.props
    const keyOptions = this.getFilterKeys()
    const getOptions = this.getFilterOptions(filterOptions)
    const filterType = filterableKeys[filterItem.key]

    return (
      <FilterItem key={`report_filter_${filterItem.key}_${index}`}>
        <Select
          name={`filter_key_${filterItem.key}_select`}
          onChange={e => Report.setFilterValues(index, e.target.value)}
          options={[{ value: '', label: 'Valitse suodatin' }, ...keyOptions]}
          value={filterItem.key}
        />
        {filterItem.key &&
          (filterType === 'search' ? (
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
              options={getOptions(filterItem.key)}
              value={filterItem.value}
              onChange={e =>
                Report.setFilterValues(index, filterItem.key, e.target.value)
              }
            />
          ))}
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
            variant={sortReports.direction === 'asc' ? 'outlined' : 'text'}
            type="button"
            onClick={this.onChangeSortDirection('asc')}>
            {get(filterLabels, 'asc', 'asc')}
          </SortButton>{' '}
          <SortButton
            variant={sortReports.direction === 'desc' ? 'outlined' : 'text'}
            type="button"
            onClick={this.onChangeSortDirection('desc')}>
            {get(filterLabels, 'desc', 'desc')}
          </SortButton>
        </div>
        <div>
          <Query query={filterOptionsQuery}>
            {({ data }) =>
              filterReports.map((filterItem, idx) =>
                this.renderFilterItem(
                  filterItem,
                  idx,
                  get(data, 'reportFilterOptions', [])
                )
              )
            }
          </Query>
          <button onClick={() => Report.addReportsFilter()}>Add filter</button>
        </div>
      </div>
    )
  }
}

export default SortAndFilter
