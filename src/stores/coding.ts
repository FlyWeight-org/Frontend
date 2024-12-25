import { isNull, map, omit } from 'lodash-es'
import * as luxon from 'luxon'
import type { Flight, FlightListItem, Load, EditableFlight, Pilot } from '@/types'

/** The shape of the pilot JSON data sent from the frontend to the back-end. */
export type PilotJSONUp = Pilot & {
  password?: string
  password_confirmation?: string
  current_password?: string
}

/** The shape of the JSON data for a Load sent from the back-end to the frontend. */
export type LoadJSONDown = Omit<Load, 'bagsWeight' | 'covid19Vaccination'> & {
  bags_weight: number
  covid19_vaccination: boolean

  flight?: FlightJSONDown
  'destroyed?'?: boolean
}

/**
 * Converts received Load JSON data into a Load interface object.
 *
 * @param JSON The JSON data received.
 * @return The Load object.
 */

export function loadFromJSON(JSON: LoadJSONDown): Load {
  return {
    ...omit(JSON, 'bags_weight', 'covid19_vaccination'),
    bagsWeight: JSON.bags_weight,
    covid19Vaccination: JSON.covid19_vaccination
  }
}

/** The shape of the JSON data for a Load sent from the frontend to the back-end. */
export type LoadJSONUp = Omit<Load, 'slug' | 'bagsWeight' | 'covid19Vaccination'> & {
  bags_weight: number
  covid19_vaccination: boolean
}

/**
 * Serializes a Load object for sending to the back-end.
 *
 * @param load The load to serialize.
 * @return The serialized load.
 */

export function loadToJSON(load: Omit<Load, 'slug'>): LoadJSONUp {
  return {
    ...omit(load, 'slug', 'bagsWeight', 'covid19Vaccination'),
    bags_weight: load.bagsWeight,
    covid19_vaccination: load.covid19Vaccination
  }
}

/** The shape of the flight JSON data sent from the back-end to the frontend. */
export type FlightJSONDown = Omit<Flight, 'UUID' | 'date' | 'loads' | 'canEdit'> & {
  uuid: string
  date: string
  loads: LoadJSONDown[] | null
  can_edit: boolean
  'destroyed?'?: boolean
}

/** The shape of the flight JSON data sent from the frontend to the back-end. */
export type FlightJSONUp = Omit<Flight, 'UUID' | 'loads' | 'date' | 'canEdit'> & {
  uuid: string
  date: string
}

/**
 * Converts a received pilot JSON representation to a Flight interface.
 *
 * @param JSON The Flight JSON to convert.
 * @return A Flight interface.
 */

export function flightFromJSON(JSON: FlightJSONDown): Flight {
  return {
    ...omit(JSON, 'uuid', 'date'),
    UUID: JSON.uuid,
    date: luxon.DateTime.fromISO(JSON.date),
    loads: isNull(JSON.loads) ? undefined : map(JSON.loads, (load) => loadFromJSON(load)),
    canEdit: JSON.can_edit
  }
}

/**
 * Converts a flight interface into JSON for sending to the back-end.
 *
 * @param flight The Flight to serialize.
 * @return The Flight JSON.
 */

export function editableFlightToJSON(flight: EditableFlight): Partial<FlightJSONUp> {
  return {
    ...omit(flight, 'date'),
    date: flight.date?.toJSON() ?? undefined
  }
}

/** The shape of flight list item data sent from the back-end. */
export type FlightListItemJSONDown = Omit<FlightListItem, 'passengerCount' | 'date' | 'UUID'> & {
  uuid: string
  date: string
  passenger_count: number
  'destroyed?'?: boolean
}

/**
 * Converts a received pilot JSON representation to a Flight list item
 * interface.
 *
 * @param JSON The Flight list item JSON to convert.
 * @return A Flight list item interface.
 */

export function flightListItemFromJSON(JSON: FlightListItemJSONDown): FlightListItem {
  return {
    ...omit(JSON, 'uuid', 'date', 'passenger_count'),
    UUID: JSON.uuid,
    date: luxon.DateTime.fromISO(JSON.date),
    passengerCount: JSON.passenger_count
  }
}

/** Information passed to the `logIn` action. */
export interface SessionJSONDown {
  email: string
  password: string
  remember_me: boolean
}
