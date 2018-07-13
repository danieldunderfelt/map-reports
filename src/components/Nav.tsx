import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { query } from '../helpers/Query'
import gql from 'graphql-tag'
import { Tabs, Tab } from '@material-ui/core'
import routes from '../routes'
import { compose } from 'react-apollo'

const datasetsTabsQuery = gql`
  {
    datasets {
      id
      label
    }
  }
`

const enhance = compose(
  inject('state', 'router'),
  query({ query: datasetsTabsQuery, fetchPolicy: 'cache-first' }),
  observer
)

const Nav = enhance(({ queryData, loading, state, router }) => {
  if (loading) {
    return []
  }

  return (
    <Tabs value={state.route} onChange={(e, route) => router.go(route)}>
      <Tab value={routes.REPORTS} label="Dashboard" />
      <Tab value={routes.CREATE_REPORT} label="Create report" />
      {queryData.datasets.map(({ id, label }) => (
        <Tab key={`dataset_tab_${id}`} value={`/${id}`} label={label} />
      ))}
    </Tabs>
  )
})

export default Nav
