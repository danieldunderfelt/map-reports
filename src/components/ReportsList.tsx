import * as React from 'react'
import { observer } from 'mobx-react'
import { query } from '../helpers/Query'
import { AnyFunction } from '../../types/AnyFunction'
import { reportsQuery } from '../queries/reportsQuery'
import { observable } from 'mobx'
import styled from 'styled-components'

type Props = {
  startPolling?: AnyFunction
  stopPolling?: AnyFunction
  data?: any
}

const SortItem = styled.span<{ active: Boolean }>`
  margin-right: 1rem;
  padding: 0.5rem;
  border: 1px solid ${({ active = false }) => active ? '#ccc' : '#efefef'};;
  background: ${({ active = false }) => active ? '#efefef' : 'transparent'}; 
  font-family: monospace;
  display: inline-block;
  margin-bottom: 0.5rem;
  
  > span {
    font-weight: ${({ active = false }) => active ? 'bold' : 'normal'}; 
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
  font-weight: ${({ active = false }) => active ? 'bold' : 'normal'};
`

const sortableKeys = ['title', 'reporter', 'status', 'priority', 'createdAt', 'updatedAt']
const filterableKeys = ['title', 'reporter', 'status', 'priority']

@query({ query: reportsQuery })
@observer
class ReportsList extends React.Component<Props, any> {
  @observable listSettings = {
    sortBy: { key: 'createdAt', direction: 'ASC' },
    filter: { key: '', value: '' }
  }

  onSort = (key, direction) => e => {
    e.preventDefault()
    this.listSettings.sortBy.key = key
    this.listSettings.sortBy.direction = direction
  }

  onFilter = e => {

  }

  render() {
    const { data } = this.props
    const { sortBy } = this.listSettings

    return (
      <div>
        <div>
           <div>
             {sortableKeys.map((key, idx) => (
               <SortItem active={sortBy.key === key} key={`sort_${key}_${idx}`}>
                 <span>
                   {key}
                 </span>{' '}
                 <SortButton active={sortBy.key === key && sortBy.direction === 'ASC'} type="button" onClick={this.onSort(key, 'ASC')}>ASC</SortButton>{' '}/{' '}
                 <SortButton active={sortBy.key === key && sortBy.direction === 'DESC'} type="button" onClick={this.onSort(key, 'DESC')}>DESC</SortButton>
               </SortItem>
             ))}
           </div>
        </div>
        {data.reports.map(report => (
          <React.Fragment key={report.id}>
            <div>
              <h2>{report.title}</h2>
              <p>{report.message}</p>
              <h4>Reported by: {report.reporter.name}</h4>
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    )
  }
}

export default ReportsList
