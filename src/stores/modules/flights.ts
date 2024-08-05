/* eslint-disable no-shadow,no-param-reassign */

import type { Errors, FlightsState } from '@/stores/types'
import { defineStore } from 'pinia'
import { clone, concat, isEmpty, isNull, some } from 'lodash-es'
import { requestJSON } from '@/stores/modules/root'
import type { FlightJSONDown, FlightListItemJSONDown } from '@/stores/coding'
import { editableFlightToJSON, flightFromJSON, flightListItemFromJSON } from '@/stores/coding'
import {
  anythingToError,
  loadAPIResponseBodyOrReturnErrors,
  loadAPIResponseBodyOrThrowErrors
} from '@/stores/utils'
import { notifyBugsnag } from '@/utils/errors'
import type { EditableFlight, Flight } from '@/types'
import { Ok, Result } from 'ts-results'
import { useAuthStore } from '@/stores/modules/auth'

const initialState: FlightsState = {
  flights: null,
  flightsLoading: false,
  flightsError: null,
  flightsSubscription: null
}

export const useFlightsStore = defineStore('flights', {
  state: () => clone(initialState),
  getters: {
    /** @return Whether the list of Flights has been loaded. */
    flightsLoaded: (state) =>
      !isNull(state.flights) && !state.flightsLoading && isNull(state.flightsError),

    /** @return True if the current pilot has no Flights. */
    noFlights: (state) => isEmpty(state.flights),

    sortedFlights: (state) =>
      isNull(state.flights)
        ? []
        : state.flights.sort((a, b) => b.date.toMillis() - a.date.toMillis())
  },

  actions: {
    reset(): void {
      this.$patch(initialState)
    },

    /**
     * Loads Flights for the current Pilot. Does nothing if flights are already
     * loading.
     *
     * @throws If an HTTP error occurs.
     */

    async loadFlights(): Promise<void> {
      if (this.flightsLoading) return

      this.reset()
      try {
        const result = await requestJSON<FlightListItemJSONDown[]>({
          path: '/pilot/flights.json'
        })
        const flights = loadAPIResponseBodyOrThrowErrors(result).map((flight) =>
          flightListItemFromJSON(flight)
        )
        this.$patch({
          flights,
          flightsLoading: false,
          flightsError: null,
          flightsSubscription: await this.createFlightsSubscription()
        })
      } catch (error) {
        this.$patch({
          flights: [],
          flightsLoading: false,
          flightsError: anythingToError(error)
        })
        notifyBugsnag(error)
      }
    },

    /**
     * Adds a flight for the logged-in Pilot.
     * @param flight Flight data to save.
     * @return A Result containing the new Flight if successful, or validation
     * errors if failed.
     * @throws If an HTTP error occurs.
     */

    async createFlight(flight: EditableFlight): Promise<Result<Flight, Errors>> {
      const result = await requestJSON<FlightJSONDown>({
        method: 'post',
        path: '/pilot/flights.json',
        body: { flight: editableFlightToJSON(flight) }
      })

      const flightResult = loadAPIResponseBodyOrReturnErrors(result)
      if (flightResult.ok) {
        await this.loadFlights()
        return new Ok(flightFromJSON(flightResult.val))
      }
      return flightResult
    },

    async createFlightsSubscription() {
      const auth = useAuthStore()

      if (this.flightsSubscription) await this.flightsSubscription.unsubscribe()
      return (
        auth.actionCableConsumer?.subscriptions?.create(
          {
            channel: 'FlightsChannel'
          },
          {
            received: (flightJSON: string) =>
              this.flightsSubscriptionMessage(JSON.parse(flightJSON))
          }
        ) || null
      )
    },

    flightsSubscriptionMessage(flightJSON: FlightListItemJSONDown) {
      if (isNull(this.flights)) return

      if (flightJSON['destroyed?']) {
        this.flights = this.flights.filter((p) => p.UUID !== flightJSON.uuid)
      } else if (some(this.flights, (p) => p.UUID === flightJSON.uuid)) {
        this.flights = [
          ...this.flights.filter((p) => p.UUID !== flightJSON.uuid),
          flightListItemFromJSON(flightJSON)
        ]
      } else {
        this.flights = concat(this.flights, flightListItemFromJSON(flightJSON))
      }
    }
  }
})
