import * as React from 'react'
import { get } from 'lodash'
import styled from 'styled-components'
import Select from '../helpers/Select'
import { Button } from '@material-ui/core'
import { inject, observer } from 'mobx-react'
import { app } from 'mobx-app'
import { Report } from '../../types/Report'
import { ReportActions } from '../../types/ReportActions'

const Sorting = styled.div`
  padding: 0 1rem;
  margin-bottom: 1rem;
`

const SortSelect = styled(Select)`
  margin-bottom: 1rem;
`

const SortOptions = styled.div`
  text-align: center;
`

const SortButton = styled(Button)``

const sortableKeys = ['title', 'reporter', 'status', 'priority', 'createdAt', 'updatedAt']

const sortLabels = {
  title: 'Otsikko',
  message: 'Viesti',
  reporter: 'Ilmoittaja',
  status: 'Vaihe',
  priority: 'Tärkeys',
  createdAt: 'Luontipäivämäärä',
  updatedAt: 'Viimeksi päivitetty',
  asc: 'Nouseva',
  desc: 'Laskeva',
}

interface Props {
  state?: {
    sortReports: {
      key: string
      direction: string
    }
  }
  Report?: ReportActions
}

@inject(app('Report'))
@observer
class SortReports extends React.Component<Props, any> {
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

  render() {
    const { state } = this.props
    const { sortReports } = state

    return (
      <Sorting>
        <SortSelect
          name="sort_reports"
          options={sortableKeys.map(sortKey => ({
            value: sortKey,
            label: get(sortLabels, sortKey, sortKey),
          }))}
          onChange={this.onChangeSortKey}
          value={sortReports.key}
        />
        <SortOptions>
          <SortButton
            variant={sortReports.direction === 'asc' ? 'outlined' : 'text'}
            type="button"
            onClick={this.onChangeSortDirection('asc')}>
            {get(sortLabels, 'asc', 'asc')}
          </SortButton>{' '}
          <SortButton
            variant={sortReports.direction === 'desc' ? 'outlined' : 'text'}
            type="button"
            onClick={this.onChangeSortDirection('desc')}>
            {get(sortLabels, 'desc', 'desc')}
          </SortButton>
        </SortOptions>
      </Sorting>
    )
  }
}

export default SortReports
