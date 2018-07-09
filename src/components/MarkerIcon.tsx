import * as React from 'react'
import { injectGlobal } from 'styled-components'
import * as L from 'leaflet'
import classnames from 'classnames'

injectGlobal`
  .marker-icon {
    
    &[style] {
      width: 0 !important;
      height: 0 !important;
      margin-top: 0 !important;
      margin-left: 0 !important;
    } 
    
    &:before {
      display: block;
      position: absolute;
      left: 50%;
      bottom: 10px;
      content: "";
      width: 2rem;
      height: 2rem;
      border: 1px solid white;
      background: blue;
      box-shadow: 0 0 10px rgba(0,0,0,1);
      border-radius: 50% 50% 0 50%;
      transform: rotate(45deg) translateX(-50%);
    }
   
    &.focused:before {
      background: red;
    }
    
    &.blurred:before {
      opacity: 0.33;
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
