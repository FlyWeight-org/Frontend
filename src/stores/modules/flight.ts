import type { Errors, FlightState } from '@/stores/types'
import { defineStore } from 'pinia'
import { clone, cloneDeep, concat, isNil, isNull, isUndefined, some } from 'lodash-es'
import { request, requestJSON } from '@/stores/modules/root'
import type { FlightJSONDown, LoadJSONDown } from '@/stores/coding'
import { editableFlightToJSON, flightFromJSON, loadFromJSON, loadToJSON } from '@/stores/coding'
import {
  anythingToError,
  ignoreResponseBody,
  loadAPIResponseBodyOrReturnErrors,
  loadAPIResponseBodyOrThrowErrors
} from '@/stores/utils'
import { notifySentry } from '@/utils/errors'
import type { EditableFlight, EditableLoad, Flight, Load } from '@/types'
import { Err, Ok, Result } from 'ts-results'
import { useFlightsStore } from '@/stores/modules/flights'
import { useAuthStore } from '@/stores/modules/auth'

const initialState: FlightState = {
  flight: null,
  flightLoading: false,
  flightError: null,
  loadsSubscription: null
}

export const useFlightStore = defineStore('flight', {
  state: () => clone(initialState),

  getters: {
    /** @return Whether the list of Flight has been loaded. */
    flightLoaded: (state) =>
      !isNull(state.flight) && !state.flightLoading && isNull(state.flightError)
  },

  actions: {
    /**
     * Sets the current flight to the Flight with the given UUID and loads it.
     * Does nothing if a flight is already loading.
     *
     * @param UUID The UUID of a flight to load. If not provided, and
     * `currentFlight` is already set, reloads the current flight. If not
     * provided, and `currentFlight` is not set, does nothing. If provided, and
     * the same as `currentFlight`, does nothing. If provided, and different from
     * `currentFlight`, changes `currentFlight` to the new flight.
     * @param force Forces a reload of the current flight, even if `UUID` is the
     * same as `currentFlight`. Has no effect in any other case.
     * @throws If an HTTP error occurs.
     */

    async loadFlight(UUID?: string, force = false): Promise<void> {
      if (this.flightLoading) return
      if (isNull(this.flight) && isUndefined(UUID)) return
      if (!isNull(this.flight)) {
        if (isUndefined(UUID)) {
          UUID = this.flight.UUID
        } else if (UUID === this.flight.UUID && !force) return
      }

      this.$patch({
        flight: null,
        flightError: null,
        flightLoading: true
      })
      try {
        const result = await requestJSON<FlightJSONDown>({
          path: `/flights/${UUID}.json`
        })
        const flight = flightFromJSON(loadAPIResponseBodyOrThrowErrors(result))
        this.$patch({
          flight,
          flightLoading: false,
          loadsSubscription: await this.createLoadsSubscription(flight.UUID)
        })
      } catch (error) {
        this.$patch({
          flightError: anythingToError(error),
          flightLoading: false,
          flight: null
        })
        notifySentry(error)
      }
    },

    /**
     * Updates a Flight using local data.
     *
     * @param flight The Flight to update and the data to update it with.
     * @return A Result containing the new Flight if successful, or validation
     * errors if failed.
     * @throws If an HTTP error occurs, or if there is no active flight.
     */

    async updateFlight(flight: EditableFlight): Promise<Result<Flight, Errors>> {
      const flights = useFlightsStore()

      if (isNull(this.flight)) throw new Error('No active flight')
      const response = await requestJSON<FlightJSONDown>({
        method: 'put',
        path: `/pilot/flights/${this.flight.UUID}.json`,
        body: { flight: editableFlightToJSON(flight) }
      })

      const result = loadAPIResponseBodyOrReturnErrors(response)
      if (result.ok) {
        await flights.loadFlights()
        const flight = flightFromJSON(result.val)
        this.$patch({
          flight,
          flightLoading: false,
          flightError: null
        })
        return new Ok(flight)
      }
      return result
    },

    /**
     * Deletes a flight.
     *
     * @param flight The Flight to delete.
     * @throws If an HTTP error occurs.
     */

    async deleteFlight(flight: Flight): Promise<void> {
      const flights = useFlightsStore()

      const response = await request({
        method: 'delete',
        path: `/pilot/flights/${flight.UUID}.json`
      })

      if (this.loadsSubscription) await this.loadsSubscription.unsubscribe()
      this.loadsSubscription = null
      await flights.loadFlights()
      ignoreResponseBody(response)
    },

    /**
     * Adds or updates a Load for the current Flight. The pilot must be logged in and adding a load
     * to an authorized flight.
     *
     * @param load the Load to add.
     * @return A Result containing the modified Flight if successful, or the Error
     * on failure.
     * @throws If an HTTP error occurs, or if there is no current flight.
     */

    async addAuthorizedLoad(load: EditableLoad): Promise<Result<Flight, Errors>> {
      const flights = useFlightsStore()

      if (isNull(this.flight)) throw new Error('No flight')

      const response = await requestJSON<FlightJSONDown>({
        method: 'post',
        path: `/pilot/flights/${this.flight.UUID}/loads.json`,
        body: { load: loadToJSON(load) }
      })

      const result = loadAPIResponseBodyOrReturnErrors(response)
      if (result.ok) {
        await flights.loadFlights()
        const flight = flightFromJSON(result.val)
        this.$patch({
          flight,
          flightLoading: false,
          flightError: null
        })
        return new Ok(flight)
      }
      return new Err(result.val)
    },

    /**
     * Adds or updates a Load for the current Flight. No active session is required.
     *
     * @param load the Load to add.
     * @return A Result containing the modified Flight if successful, or the Error
     * on failure.
     * @throws If an HTTP error occurs, or if there is no current flight.
     */

    async addUnauthorizedLoad(load: EditableLoad): Promise<Result<Load, Errors>> {
      if (isNull(this.flight)) throw new Error('No flight')

      const response = await requestJSON<LoadJSONDown>({
        method: 'post',
        path: `/flights/${this.flight.UUID}/loads.json`,
        body: { load: loadToJSON(load) }
      })

      const result = loadAPIResponseBodyOrReturnErrors(response)
      if (result.ok) {
        const load = loadFromJSON(result.val)
        return new Ok(load)
      }
      return new Err(result.val)
    },

    /**
     * Removes a Load for a current Flight by slug. Must be authenticated.
     *
     * @param slug The unique identifier for the load.
     * @return The modified Flight.
     * @throws If an HTTP error occurs, or if there is no current flight.
     */

    async removeLoad(slug: string): Promise<Flight> {
      const flights = useFlightsStore()

      if (isNull(this.flight)) throw new Error('No flight')

      const response = await requestJSON<FlightJSONDown>({
        method: 'delete',
        path: `/pilot/flights/${this.flight.UUID}/loads/${slug}.json`
      })

      const flightJSON = loadAPIResponseBodyOrThrowErrors(response)
      await flights.loadFlights()
      const flight = flightFromJSON(flightJSON)
      this.$patch({
        flight,
        flightLoading: false,
        flightError: null
      })
      return flight
    },

    toggleEnabled(slug: string, enabled: boolean): void {
      if (isNull(this.flight)) return

      const flight = cloneDeep(this.flight)
      if (isUndefined(flight.loads)) return

      const load = flight.loads.find((load) => load.slug === slug)
      if (isUndefined(load)) return

      load.disabled = !enabled

      this.$patch({ flight })
    },

    async createLoadsSubscription(UUID: string) {
      const auth = useAuthStore()

      if (this.loadsSubscription) await this.loadsSubscription.unsubscribe()
      return (
        auth.actionCableConsumer?.subscriptions?.create(
          {
            channel: 'LoadsChannel',
            id: UUID
          },
          {
            received: (loadJSON: string) =>
              this.loadsSubscriptionMessage(UUID, JSON.parse(loadJSON))
          }
        ) || null
      )
    },

    loadsSubscriptionMessage(flightID: string, loadJSON: LoadJSONDown) {
      if (isNull(this.flight)) return
      if (this.flight.UUID !== flightID) return
      if (isNil(this.flight.loads)) return

      const flight = cloneDeep(this.flight)
      if (isNil(flight.loads)) return

      if (loadJSON['destroyed?']) {
        flight.loads = flight.loads.filter((p) => p.slug !== loadJSON.slug)
      } else if (some(flight.loads, (p) => p.slug === loadJSON.slug)) {
        flight.loads = [
          ...flight.loads.filter((p) => p.slug !== loadJSON.slug),
          loadFromJSON(loadJSON)
        ]
      } else {
        flight.loads = concat(flight.loads, loadFromJSON(loadJSON))
      }
      this.$patch({ flight })
    }
  }
})
