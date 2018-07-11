import { LatLng } from 'leaflet'
import { AnyFunction } from './AnyFunction'

export const enum MarkerState {
  focus,
  inactive,
  default
}

export interface Marker {
  state: MarkerState
  id: string
  type: string
  zoom?: number
  position: LatLng
  message?: string
  onClick?: AnyFunction
}
