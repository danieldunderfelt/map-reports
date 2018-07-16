import * as React from 'react'
import { compose } from 'react-apollo'
import { query } from '../helpers/Query'
import gql from 'graphql-tag'
import Map from '../components/Map'
import { inject, observer } from 'mobx-react'
import { get } from 'lodash'
import styled, { injectGlobal } from 'styled-components'
import { ReportFragment } from '../fragments/ReportFragment'
import { mutate } from '../helpers/Mutation'
import * as prettyJson from 'prettyjson'
import * as L from 'leaflet'

import middleOfLine from '../helpers/middleOfLine'
const MapArea = styled.div`
  height: calc(100vh - 3rem);
`

injectGlobal`
  .feature-props {
    white-space: pre-line;
  }
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

const createStopReportMutation = gql`
  mutation createStopReport($reportData: InputReport!, $reportItem: InputReportItem!) {
    createReport(reportData: $reportData, reportItem: $reportItem) {
      ...ReportFields
    }
  }
  ${ReportFragment}
`

const enhance = compose(
  inject('router'),
  query({ query: datasetsQuery }),
  mutate({ mutation: createStopReportMutation }),
  observer
)

class MissingRoadsMap extends React.Component<any, any> {
  componentDidMount() {
    // Attach the create issue handler to a global so that the inline js can call it.
    // @ts-ignore
    window.__handleMissingRoadClick = this.onCreateIssue
  }

  onCreateIssue = async (lat, lon, feature) => {
    const { mutate } = this.props
    const featureJson = window.atob(feature)

    await mutate({
      variables: {
        reportData: {
          title: `Missing road`,
          message: `There should be a road here.`,
        },
        reportItem: {
          location: {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
          },
          feature: featureJson,
          recommendedMapZoom: 16,
          type: 'general',
        },
      },
    })
  }

  render() {
    const { queryData } = this.props

    const missingRoadsDataset = get(queryData, 'datasets', []).find(
      d => d.id === 'missing_roads'
    )

    if (!missingRoadsDataset) {
      return 'Loading...'
    }

    return (
      <MapArea>
        <Map
          onEachFeature={(feature, layer) => {
            const type = get(feature, 'geometry.type', 'MultiLineString')
            let line

            if (type === 'LineString') {
              line = get(feature, 'geometry.coordinates')
            }

            if (type === 'MultiLineString') {
              line = get(feature, 'geometry.coordinates[0]')
            }

            const lineMiddle = middleOfLine(line)

            const lat = lineMiddle[1]
            const lon = lineMiddle[0]
            // Stringify feature and base64 encode it to make it work inline
            const featureJson = window.btoa(JSON.stringify(feature))

            /**
             * The geojson layer does not support React-leaflets React components, so we
             * have to do this with plain HTML. __handleMissingRoadClick is a global
             * that points to onCreateIssue() in this component. Make sure to feed
             * it only strings, as numbers may get converted to characters.
             */

            const popupContent = `
              <div>
                <pre class="feature-props"><code>
                  ${prettyJson.render(feature.properties)}
                </code></pre>
                <p>
                  <button onclick="__handleMissingRoadClick('${lat}', '${lon}', '${featureJson}')">
                    Create report
                  </button>
                </p>
              </div>
            `
            layer.bindPopup(L.popup({ minWidth: 250 }).setContent(popupContent))
          }}
          geoJSON={JSON.parse(missingRoadsDataset.geoJSON)}
        />
      </MapArea>
    )
  }
}

export default enhance(MissingRoadsMap)
