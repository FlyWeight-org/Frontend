import { map, omit } from 'lodash-es'
import * as luxon from 'luxon'
import { z } from 'zod'
import type { Flight, FlightListItem, Load, EditableFlight, Pilot } from '@/types'

const pilotSchema = z.object({
  email: z.string().optional(),
  name: z.string(),
})

const loadJSONDownBaseSchema = z.object({
  slug: z.string(),
  name: z.string(),
  weight: z.number(),
  bags_weight: z.number(),
  disabled: z.boolean().optional(),
  'destroyed?': z.boolean().optional(),
})

const flightJSONDownSchema = z.object({
  uuid: z.string(),
  date: z.string(),
  description: z.string(),
  pilot: pilotSchema,
  loads: z.array(loadJSONDownBaseSchema.extend({ flight: z.unknown().optional() })).nullish(),
  can_edit: z.boolean(),
  'destroyed?': z.boolean().optional(),
})

export const loadJSONDownSchema = loadJSONDownBaseSchema.extend({
  flight: flightJSONDownSchema.optional(),
})

export const flightListItemJSONDownSchema = z.object({
  uuid: z.string(),
  date: z.string(),
  description: z.string(),
  passenger_count: z.number(),
  'destroyed?': z.boolean().optional(),
})

/** The shape of the pilot JSON data sent from the frontend to the back-end. */
export type PilotJSONUp = Pilot & {
  password?: string
  password_confirmation?: string
  current_password?: string
}

/** The shape of the JSON data for a Load sent from the back-end to the frontend. */
export type LoadJSONDown = Omit<Load, 'bagsWeight'> & {
  bags_weight: number

  flight?: FlightJSONDown
  'destroyed?'?: boolean
}

/**
 * Converts received Load JSON data into a Load interface object.
 *
 * @param JSON The JSON data received.
 * @return The Load object.
 */

export function loadFromJSON(data: unknown): Load {
  const JSON = loadJSONDownSchema.parse(data)
  return {
    ...omit(JSON, 'bags_weight'),
    bagsWeight: JSON.bags_weight,
    disabled: JSON.disabled ?? false,
  }
}

/** The shape of the JSON data for a Load sent from the frontend to the back-end. */
export type LoadJSONUp = Omit<Load, 'slug' | 'bagsWeight'> & {
  bags_weight: number
}

/**
 * Serializes a Load object for sending to the back-end.
 *
 * @param load The load to serialize.
 * @return The serialized load.
 */

export function loadToJSON(load: Omit<Load, 'slug'>): LoadJSONUp {
  return {
    ...omit(load, 'slug', 'bagsWeight'),
    bags_weight: load.bagsWeight,
  }
}

/** The shape of the flight JSON data sent from the back-end to the frontend. */
export type FlightJSONDown = Omit<Flight, 'UUID' | 'date' | 'loads' | 'canEdit'> & {
  uuid: string
  date: string
  loads?: LoadJSONDown[] | null
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

export function flightFromJSON(data: unknown): Flight {
  const JSON = flightJSONDownSchema.parse(data)
  return {
    ...omit(JSON, 'uuid', 'date'),
    UUID: JSON.uuid,
    date: luxon.DateTime.fromISO(JSON.date),
    loads:
      JSON.loads === null || JSON.loads === undefined
        ? undefined
        : map(JSON.loads, (load) => loadFromJSON(load)),
    canEdit: JSON.can_edit,
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
    date: flight.date?.toJSON() ?? undefined,
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

export function flightListItemFromJSON(data: unknown): FlightListItem {
  const JSON = flightListItemJSONDownSchema.parse(data)
  return {
    ...omit(JSON, 'uuid', 'date', 'passenger_count'),
    UUID: JSON.uuid,
    date: luxon.DateTime.fromISO(JSON.date),
    passengerCount: JSON.passenger_count,
  }
}

/** Information passed to the `logIn` action. */
export interface SessionJSONDown {
  email: string
  password: string
  remember_me: boolean
}
