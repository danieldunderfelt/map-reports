import * as React from 'react'
import { compose } from 'react-apollo'
import { query } from '../helpers/Query'
import gql from 'graphql-tag'
import Map from './Map'
import { inject, observer } from 'mobx-react'
import { get } from 'lodash'
import styled from 'styled-components'
import { ReportFragment } from '../fragments/ReportFragment'
import { mutate } from '../helpers/Mutation'
import { marker, popup } from 'leaflet'
import MarkerIcon from './MarkerIcon'
import { DatasetView } from '../../types/DatasetView'
import { AnyFunction } from '../../types/AnyFunction'
import { Dataset } from '../../types/Dataset'

const MapArea = styled.div`
  height: calc(100vh - 3rem);
`

const datasetQuery = gql`
  query datasetData($id: String!) {
    dataset(id: $id) {
      id
      label
      geoJSON
    }
  }
`

const createStopReportMutation = gql`
  mutation createStopReport($reportData: InputReport!, $reportItem: InputReportItem!) {
    createReport(reportData: $reportData, reportItem: $reportItem) {
      ...ReportFields
    }
  }
  ${ReportFragment}
`

const enhance = compose(
  query({ query: datasetQuery, getVariables: ({ datasetId }) => ({ id: datasetId }) }),
  mutate({ mutation: createStopReportMutation }),
  observer
)

interface Props extends DatasetView {
  mutate?: AnyFunction
  queryData?: { dataset: Dataset }
  loading?: boolean
}

class UnconnectedStopsMap extends React.Component<Props, any> {
  componentDidMount() {
    // Attach the create issue handler to a global so that the inline js can call it.
    // @ts-ignore
    window.__handleUnconnectedStopMarkerClick = this.onCreateIssue
  }

  onCreateIssue = async (stopId, lat, lon) => {
    const { mutate } = this.props

    await mutate({
      variables: {
        reportData: {
          title: `Unconnected stop ${stopId}`,
          message: `JORE stop ${stopId} is not connected to an OSM stop.`,
        },
        reportItem: {
          location: {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
          },
          stopCode: stopId,
          recommendedMapZoom: 18,
          type: 'stop',
        },
      },
    })
  }

  render() {
    const { queryData, loading } = this.props

    const unconnectedStopsDataset = get(queryData, 'dataset', null)

    if (!unconnectedStopsDataset || loading) {
      return 'Loading...'
    }

    return (
      <MapArea>
        <Map
          pointToLayer={({ properties }, latlng) => {
            const stopId = get(properties, 'stop_code', '[Unknown stop]')
            const lat = latlng.lat
            const lon = latlng.lng

            /**
             * The markers created by the geojson layer do not support React-leaflets
             * React components, so we have to do this with plain HTML.
             * __handleUnconnectedStopMarkerClick is a global that points to onCreateIssue() in this component.
             * Make sure to feed it only strings, as numbers may get converted to characters.
             */

            const popupContent = `
              <div>
                <div>
                  Stop: ${stopId}
                </div>
                <button onclick="__handleUnconnectedStopMarkerClick('${stopId}', '${lat}', '${lon}')">
                  Create report
                </button>
              </div>
            `

            const bubble = popup({ minWidth: 150 }).setContent(popupContent)

            return marker(latlng, {
              icon: MarkerIcon({ type: 'general' }),
            }).bindPopup(bubble)
          }}
          geoJSON={JSON.parse(unconnectedStopsDataset.geoJSON)}
        />
      </MapArea>
    )
  }
}

export default enhance(UnconnectedStopsMap)
