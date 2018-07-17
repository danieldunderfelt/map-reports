import * as React from 'react'
import gql from 'graphql-tag'
import { inject, observer } from 'mobx-react'
import { compose } from 'react-apollo'
import { query } from '../helpers/Query'
import styled from 'styled-components'
import { Card, Typography } from '@material-ui/core'
import Select from '../helpers/Select'
import MissingRoadsMap from '../components/MissingRoadsMap'
import UnconnectedStopsMap from '../components/UnconnectedStopsMap'
import { get } from 'lodash'

const datasetOptionsQuery = gql`
  {
    datasets {
      id
      label
    }
  }
`

const DatasetsWrapper = styled.div`
  position: relative;
`

const OptionsBox = styled(Card)`
  position: absolute;
  top: 0.7rem;
  left: 3.5rem;
  width: 20%;
  padding: 1rem;
`

const enhance = compose(
  inject('actions', 'state', 'router'),
  query({ query: datasetOptionsQuery, fetchPolicy: 'cache-first' }),
  observer
)

const datasetMaps = {
  missing_roads: MissingRoadsMap,
  unconnected_stops: UnconnectedStopsMap,
}

class InspectDatasets extends React.Component<any, any> {
  onChangeDataset = e => {
    const { actions: { UI } } = this.props
    UI.selectDataset(e.target.value)
  }

  render() {
    const { queryData, loading, state } = this.props

    if (!queryData || loading) {
      return 'Loading...'
    }

    const MapComponent = get(datasetMaps, state.selectedDataset, null)

    return (
      <DatasetsWrapper>
        {MapComponent && <MapComponent datasetId={state.selectedDataset} />}
        <OptionsBox>
          <Typography gutterBottom variant="headline" component="h2">
            Tarkastastele ja raportoi
          </Typography>
          <Select value={state.selectedDataset} onChange={this.onChangeDataset}>
            {[
              { value: '', label: 'Valitse kartta' },
              ...queryData.datasets.map(({ id, label }) => ({ value: id, label })),
            ]}
          </Select>
        </OptionsBox>
      </DatasetsWrapper>
    )
  }
}

export default enhance(InspectDatasets)
