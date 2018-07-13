import * as React from 'react'
import { compose } from 'react-apollo'
import { query } from '../helpers/Query'
import gql from 'graphql-tag'
import Map from '../components/Map'
import { observer } from 'mobx-react'
import { get } from 'lodash'
import styled from 'styled-components'
import { renderToStaticMarkup } from 'react-dom/server'

const MapArea = styled.div`
  height: calc(100vh - 3rem);
`

const datasetsQuery = gql`
  {
    datasets {
      id
      label
      geoJSON
    }
  }
`

const enhance = compose(
  query({ query: datasetsQuery }),
  observer
)

class UnconnectedStopsMap extends React.Component<any, any> {
  componentDidMount() {
    // @ts-ignore
    window.__handleMarkerClick = this.onCreateIssue
  }

  onCreateIssue = stopId => {
    console.log(stopId)
  }

  render() {
    const { queryData } = this.props

    const unconnectedStopsDataset = get(queryData, 'datasets', []).find(
      d => d.id === 'unconnected_stops'
    )

    if (!unconnectedStopsDataset) {
      return 'Loading...'
    }

    return (
      <MapArea>
        <Map
          getMarkerMessage={({ properties }) => {
            const stopId = get(properties, 'stop_code', '[Unknown stop]')

            return `
              <div>
                <div>
                  Stop: ${stopId}
                </div>
                <button onclick="__handleMarkerClick('${stopId}')">
                  Create issue
                </button>
              </div>
            `
          }}
          geoJSON={JSON.parse(unconnectedStopsDataset.geoJSON)}
        />
      </MapArea>
    )
  }
}

export default enhance(UnconnectedStopsMap)
