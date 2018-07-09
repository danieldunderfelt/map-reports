import * as React from 'react'
import { injectGlobal } from 'styled-components'
import * as L from 'leaflet'
import classnames from 'classnames'

injectGlobal`
  .marker-icon {
    width: 30px;
    height: 30px;
    background: blue; 
   
    &.focused {
      background: red;
    }
    
    &.blurred {
      opacity: 0.25;
      background: blue;
    }
  }
`

export default ({ focused = false, blurred = false }) =>
  L.divIcon({
    className: classnames({
      'marker-icon': true,
      focused: focused && !blurred,
      blurred: blurred && !focused,
    }),
  })
