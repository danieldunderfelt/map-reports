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
      z-index: -1;
      left: 14px;
      bottom: -5px;
      width: 1.5rem;
      height: 1.5rem;
      content: "";
      border: 0;
      box-shadow: none;
      filter: blur(4px);
      opacity: 0.75;
      background: linear-gradient(-15deg, rgba(0,0,0,0.33) 30%, rgba(0,0,0,0));
      border-radius: 50% 50% 0 50%;
      transform: skew(-60deg, 15deg) rotate(30deg) translateX(-50%);
    }
    
    &:after {
      position: absolute;
      z-index: 10;
      left: -3px;
      bottom: -4px;
      content: "";
      width: 1.5rem;
      height: 1.5rem;
      background: var(--blue);
      border-radius: 50% 50% 0 50%;
      border: 1px solid rgba(255, 255, 255, 0.75);
      outline: 0;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.5);
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
    
    &.type_stop:after {
      background: darkorchid;
    }
    
    &.type_general:after {
      background: var(--blue);
    }
    
    &.type_new-report:after {
      background: #7bc11d;
    }
  }
  
  .leaflet-popup {
    &[style] {
       bottom: 1.75rem !important;
       margin-left: 1px;
    }
  }
  
  .marker-cluster {
    border: 0;
    background: transparent;
  }
  
  .marker-cluster-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border-radius: 50%;
    background: var(--blue);
    width: calc(1.5rem + (var(--count) * 0.25rem));
    height: calc(1.5rem + (var(--count) * 0.25rem));
    margin: 50%;
    font-size: calc(1rem + (var(--count) * 0.1rem));
  }
`

export default ({ focused = false, blurred = false, type }) =>
  L.divIcon({
    className: classNames({
      'marker-icon': true,
      [`type_${type}`]: !!type,
      focused: focused && !blurred,
      blurred: blurred && !focused,
    }),
  })
