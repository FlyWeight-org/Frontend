import type { DateTime } from 'luxon'

export interface Passkey {
  id: string
  label: string | null
  lastUsedAt: DateTime | null
}

export interface Pilot {
  email?: string
  name: string
  passkeys?: Passkey[]
}

export interface Load {
  slug: string
  name: string
  weight: number
  bagsWeight: number

  disabled: boolean
}

export type EditableLoad = Omit<Load, 'slug'>

export function isPassenger(load: Load): boolean {
  return load.weight > 0
}

export function isCargo(load: Load): boolean {
  return load.weight === 0 && load.bagsWeight > 0
}

export interface FlightListItem {
  UUID: string
  date: DateTime
  description: string
  passengerCount: number
}

export type Flight = Omit<FlightListItem, 'passengerCount'> & {
  canEdit: boolean
  pilot: Pilot
  loads?: Load[]
}

export interface EditableFlight {
  date?: DateTime
  description: string
}
