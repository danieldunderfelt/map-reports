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
      left: 10px;
      bottom: -5px;
      width: 1.5rem;
      height: 1.5rem;
      content: "";
      border: 0;
      box-shadow: none;
      filter: blur(3px);
      background: linear-gradient(-15deg, rgba(0,0,0,0.33) 30%, rgba(0,0,0,0));
      border-radius: 50% 50% 0 50%;
      transform: skew(-60deg, 15deg) rotate(30deg) translateX(-50%);
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
  
  .leaflet-popup {
    &[style] {
       bottom: 1.75rem !important;
       margin-left: 1px;
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
