import { map, omit } from 'lodash-es'
import * as luxon from 'luxon'
import { z } from 'zod'
import type { Flight, FlightListItem, Load, EditableFlight, Passkey, Pilot } from '@/types'

const passkeySchema = z.object({
  id: z.string(),
  label: z.string().nullable(),
  last_used_at: z.string().nullable(),
})

const pilotSchema = z.object({
  email: z.string().optional(),
  name: z.string(),
  passkeys: z.array(passkeySchema).optional(),
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

/** Shape of pilot JSON data sent from the frontend to the back-end. */
export interface PilotJSONUp {
  name: string
  email: string
}

/** Shape of pilot JSON data received from the back-end. */
export interface PilotJSONDown {
  name: string
  email: string
  passkeys: PasskeyJSONDown[]
  access_token?: string
  refresh_token?: string
}

export interface PasskeyJSONDown {
  id: string
  label: string | null
  last_used_at: string | null
}

/**
 * Converts received pilot JSON to a Pilot interface.
 *
 * @param data The JSON data received.
 * @return The Pilot object.
 */

export function pilotFromJSON(data: unknown): Pilot {
  const JSON = pilotSchema.parse(data)
  return {
    email: JSON.email,
    name: JSON.name,
    passkeys: JSON.passkeys?.map(passkeyFromJSON) ?? [],
  }
}

/**
 * Converts received passkey JSON to a Passkey interface.
 *
 * @param data The JSON data received.
 * @return The Passkey object.
 */

export function passkeyFromJSON(data: PasskeyJSONDown): Passkey {
  return {
    id: data.id,
    label: data.label,
    lastUsedAt: data.last_used_at ? luxon.DateTime.fromISO(data.last_used_at) : null,
  }
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
    ...omit(JSON, 'uuid', 'date', 'pilot'),
    UUID: JSON.uuid,
    date: luxon.DateTime.fromISO(JSON.date),
    pilot: pilotFromJSON(JSON.pilot),
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

/** Credentials sent to the `logIn` action. */
export interface SessionJSONDown {
  login: string
  password: string
  turnstile_token: string
}

/** Payload sent to the `signUp` action. */
export interface SignUpJSONUp {
  login: string
  password: string
  name: string
  turnstile_token: string
}

/** Payload sent to the `forgotPassword` action. */
export interface ForgotPasswordJSONUp {
  login: string
  turnstile_token: string
}
