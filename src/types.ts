import { isUndefined } from "lodash-es";
import type { DateTime } from "luxon";

export interface Pilot {
  email?: string;
  name: string;
}

export interface Load {
  slug: string;
  name: string;
  weight: number;
  bagsWeight: number;
  covid19Vaccination: boolean;
}

export type EditableLoad = Omit<Load, "slug">;

export function isPassenger(load: Load): boolean {
  return load.weight > 0;
}

export function isCargo(load: Load): boolean {
  return load.weight === 0 && load.bagsWeight > 0;
}

export interface FlightListItem {
  UUID: string;
  date: DateTime;
  description: string;
  passengerCount: number;
}

export type Flight = Omit<FlightListItem, "passengerCount"> & {
  canEdit: boolean;
  pilot: Pilot;
  loads?: Load[];
};

export interface EditableFlight {
  date?: DateTime;
  description: string;
}

export function passengerCount(flight: Flight): number {
  if (isUndefined(flight.loads)) return 0;
  return flight.loads.filter((load) => isPassenger(load)).length;
}
