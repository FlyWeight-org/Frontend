import { describe, expect, it } from 'vitest'
import { poundsToUnit, unitToPounds } from '../weight'

describe('weight', () => {
  it('converts pounds to kilograms', () => {
    expect(poundsToUnit(100, 'kg')).toBeCloseTo(45.36, 2)
  })

  it('converts kilograms to pounds', () => {
    expect(unitToPounds(45.36, 'kg')).toBeCloseTo(100, 1)
  })
})
