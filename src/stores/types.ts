import type { Result } from 'ts-results'
import type { Flight, FlightListItem, Pilot } from '@/types'
import { Subscription } from '@rails/actioncable'

/**
 * The shape of validation errors received from the back-end. A dictionary mapping field names to a
 * list of their errors.
 */
export type Errors = Record<string, string[]>

/**
 * A store-friendly error type that avoids the `cause` property on the native `Error` type.
 * Pinia 3.x `_DeepPartial` cannot reconcile `Error.cause` (`unknown`) with
 * `_DeepPartial<unknown> | undefined`, so we use this narrower type in store state interfaces
 * while still being assignable from real `Error` instances.
 */
export interface StoreError {
  name: string
  message: string
  stack?: string
}

export interface AccountState {
  currentPilot: Pilot | null
  currentPilotLoading: boolean
  currentPilotError: StoreError | null
}

export interface AuthState {
  JWT: string | null
  refreshToken: string | null
  loggingIn: boolean
}

export interface FlightsState {
  flights: FlightListItem[] | null
  flightsLoading: boolean
  flightsError: StoreError | null
  flightsSubscription: Subscription | null
}

export interface FlightState {
  flight: Flight | null
  flightLoading: boolean
  flightError: StoreError | null
  loadsSubscription: Subscription | null
}

export interface APISuccess<T> {
  response: Response
  body?: T
}

export interface APIFailure {
  response: Response
  body: { errors?: Errors; error?: string }
}

export type APIResponse<T> = Result<APISuccess<T>, APIFailure>
