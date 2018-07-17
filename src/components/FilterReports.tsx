import * as React from 'react'
import styled from 'styled-components'
import { inject, Observer, observer } from 'mobx-react'
import { app } from 'mobx-app'
import { get } from 'lodash'
import { Report } from '../../types/Report'
import Select from '../helpers/Select'
import { ReportActions } from '../../types/ReportActions'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Button, TextField, Paper } from '@material-ui/core'
import { Delete } from '@material-ui/icons'

const Filtering = styled.div`
  padding: 0 1rem;
  margin-bottom: 1rem;
`

const FilterItem = styled(Paper)`
  display: grid;
  grid-template-columns: 10rem 1fr 3rem;
  grid-gap: 0.5rem;
  align-items: center;
  justify-content: space-around;
  padding: 1rem 0.5rem 1rem 1rem;
  margin: 0.5rem 0;
  border: 1px solid #eee;

  button {
    flex: none;
    text-align: right;
    align-items: flex-end;
    padding: 0;
    min-width: 0;
  }
`

const FilterSearchInput = styled(TextField)`
  width: 100%;
`

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
class FilterReports extends React.Component<Props, any> {
  getFilterOptions = options => (key: string) => {
    return get(options.find(opt => opt.key === key), 'options', [])
  }

  getFilterKeys = () =>
    Object.keys(filterableKeys).map(filterKey => ({
      value: filterKey,
      label: get(filterLabels, filterKey, filterKey),
    }))

  onChangeFilterKey = index => e => {
    const { Report } = this.props
    Report.setFilterValues(index, e.target.value)
  }

  onChangeFilterValue = (index, key) => e => {
    const { Report } = this.props
    Report.setFilterValues(index, key, e.target.value)
  }

  render() {
    const { state, Report } = this.props
    const { filterReports } = state
    const keyOptions = this.getFilterKeys()

    return (
      <Filtering>
        <Query query={filterOptionsQuery}>
          {({ data }) => (
            <Observer>
              {() =>
                filterReports.map((filterItem, index) => {
                  const filterOptions = get(data, 'reportFilterOptions', [])
                  const getOptions = this.getFilterOptions(filterOptions)
                  const filterType = filterableKeys[filterItem.key]

                  return (
                    <FilterItem key={`report_filter_${filterItem.key}_${index}`}>
                      <Select
                        name={`filter_key_${filterItem.key}_select`}
                        onChange={this.onChangeFilterKey(index)}
                        options={[
                          { value: '', label: 'Valitse suodatin' },
                          ...keyOptions,
                        ]}
                        value={filterItem.key}
                      />
                      {filterItem.key ? (
                        filterType === 'search' ? (
                          <FilterSearchInput
                            key={`filter_key_values_${filterItem.key}`}
                            margin="none"
                            value={filterItem.value}
                            onChange={this.onChangeFilterValue(index, filterItem.key)}
                          />
                        ) : (
                          <Select
                            key={`filter_key_values_${filterItem.key}`}
                            name={`filter_options_${filterItem.key}_select`}
                            options={getOptions(filterItem.key)}
                            value={filterItem.value}
                            onChange={this.onChangeFilterValue(index, filterItem.key)}
                          />
                        )
                      ) : (
                        <div key={`null_placeholder_${filterItem.key}`} />
                      )}
                      <Button
                        size="small"
                        color="secondary"
                        onClick={() => Report.removeFilter(index)}
                        aria-label="Delete">
                        <Delete />
                      </Button>
                    </FilterItem>
                  )
                })
              }
            </Observer>
          )}
        </Query>
        <Button variant="contained" onClick={() => Report.addReportsFilter()}>
          Add filter
        </Button>
      </Filtering>
    )
  }
}

export default FilterReports
