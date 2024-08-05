/* eslint-disable @typescript-eslint/no-empty-interface */

import type { Result } from 'ts-results'
import type { Flight, FlightListItem, Pilot } from '@/types'
import { Subscription } from '@rails/actioncable'

/**
 * The shape of validation errors received from the back-end. A dictionary mapping field names to a
 * list of their errors.
 */
export type Errors = Record<string, string[]>

export interface RootState {}

export interface AccountState {
  currentPilot: Pilot | null
  currentPilotLoading: boolean
  currentPilotError: Error | null
}

export interface AuthState {
  JWT: string | null
  loggingIn: boolean
}

export interface FlightsState {
  flights: FlightListItem[] | null
  flightsLoading: boolean
  flightsError: Error | null
  flightsSubscription: Subscription | null
}

export interface FlightState {
  flight: Flight | null
  flightLoading: boolean
  flightError: Error | null
  loadsSubscription: Subscription | null
}

export type AnyModuleState = FlightsState | FlightState | AuthState

export interface APISuccess<T> {
  response: Response
  body?: T
}

export interface APIFailure {
  response: Response
  body: { errors?: Errors; error?: string }
}

export type APIResponse<T> = Result<APISuccess<T>, APIFailure>
