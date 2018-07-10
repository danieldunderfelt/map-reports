import { LatLngExpression } from 'leaflet'
import { AnyFunction } from './AnyFunction'

export const enum MarkerState {
  focus,
  inactive,
  default
}

export interface Marker {
  state: MarkerState
  id: string
  position: LatLngExpression
  message?: string
  onClick?: AnyFunction
}
