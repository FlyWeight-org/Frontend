export type WeightUnit = 'lb' | 'kg'

export const POUNDS_PER_KILOGRAM = 2.2046226218

/**
 * Converts a weight in pounds to the given display unit.
 *
 * @param pounds The weight in pounds.
 * @param unit The unit to convert to.
 * @return The weight expressed in the given unit.
 */

export function poundsToUnit(pounds: number, unit: WeightUnit): number {
  return unit === 'kg' ? pounds / POUNDS_PER_KILOGRAM : pounds
}

/**
 * Converts a weight entered in the given unit back to pounds.
 *
 * @param value The weight expressed in the given unit.
 * @param unit The unit the value is expressed in.
 * @return The weight in pounds.
 */

export function unitToPounds(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value * POUNDS_PER_KILOGRAM : value
}

/**
 * Maps a weight unit to its `Intl.NumberFormat` unit identifier.
 *
 * @param unit The weight unit.
 * @return The corresponding sanctioned Intl unit identifier.
 */

export function weightUnitToI18nUnit(unit: WeightUnit): string {
  return unit === 'kg' ? 'kilogram' : 'pound'
}
