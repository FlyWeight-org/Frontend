import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFlightStore } from '@/stores/modules/flight'
import { useAccountStore } from '@/stores/modules/account'
import { poundsToUnit, unitToPounds, weightUnitToI18nUnit, type WeightUnit } from '@/utils/weight'

export default function useWeight(unitSource?: MaybeRefOrGetter<WeightUnit | undefined>) {
  const { n, locale } = useI18n()
  const flightStore = useFlightStore()
  const accountStore = useAccountStore()

  const unit = computed<WeightUnit>(
    () =>
      toValue(unitSource) ??
      flightStore.flight?.pilot.weightUnit ??
      accountStore.currentPilot?.weightUnit ??
      'lb',
  )
  const unitSymbol = computed(() => {
    const parts = new Intl.NumberFormat(locale.value, {
      style: 'unit',
      unit: weightUnitToI18nUnit(unit.value),
      unitDisplay: 'short',
    }).formatToParts(0)
    return parts.find((part) => part.type === 'unit')?.value ?? unit.value
  })
  const display = (pounds: number): string =>
    n(poundsToUnit(pounds, unit.value), unit.value === 'kg' ? 'kilograms' : 'pounds')
  const toPounds = (value: number): number => unitToPounds(value, unit.value)

  return { unit, unitSymbol, display, toPounds }
}
