import * as React from 'react'
import { injectGlobal } from 'styled-components'
import * as L from 'leaflet'
import classNames from 'classnames'
import { darken } from 'polished'

injectGlobal`
  .marker-icon {
    
    &[style] {
      width: 0 !important;
      height: 0 !important;
      background: red;
      margin-top: 0 !important;
      margin-left: 0 !important;
    } 
    
    &:before {
      position: absolute;
      left: 6px;
      bottom: -4px;
      width: 1.5rem;
      height: 1.5rem;
      content: "";
      border: 0;
      box-shadow: none;
      background: linear-gradient(160deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5));
      border-radius: 50% 50% 0 50%;
      transform: skewX(-50deg) rotate(45deg) translateX(-50%);
    }
    
    &:after {
      position: absolute;
      left: -3px;
      bottom: -4px;
      content: "";
      width: 1.5rem;
      height: 1.5rem;
      background: blue;
      border-radius: 50% 50% 0 50%;
      transform: rotate(45deg) translateX(-50%);
    }
   
    &.focused:after {
      background: red;
    }
    
    &.blurred {
      opacity: 0.33;
      
      &:after {
        background: blue; 
      }
    }
  }
`

export default ({ focused = false, blurred = false }) =>
  L.divIcon({
    className: classNames({
      'marker-icon': true,
      focused: focused && !blurred,
      blurred: blurred && !focused,
    }),
  })
