/* eslint-disable camelcase,no-shadow */

import { defineStore } from "pinia";
import type { AccountState, APIResponse, Errors } from "@/stores/types";
import type { PilotJSONUp } from "@/stores/coding";
import { Err, Ok, Result } from "ts-results";
import type { Pilot } from "@/types";
import { request, requestJSON } from "@/stores/modules/root";
import {
  anythingToError,
  ignoreAPIResponseBodyOrReturnErrors,
  ignoreResponseBody,
  loadAPIResponseBodyOrReturnErrors,
  loadAPIResponseBodyOrThrowErrors,
} from "@/stores/utils";
import { notifyBugsnag } from "@/utils/errors";
import { useAuthStore } from "@/stores/modules/auth";
import { useFlightsStore } from "@/stores/modules/flights";
import { clone } from "lodash-es";

const initialState: AccountState = {
  currentPilot: null,
  currentPilotLoading: false,
  currentPilotError: null,
};

export const useAccountStore = defineStore("account", {
  state: () => clone(initialState),
  actions: {
    reset(): void {
      this.$patch(initialState);
    },

    setCurrentPilot(pilot: Pilot): void {
      this.$patch({
        currentPilot: pilot,
        currentPilotError: null,
        currentPilotLoading: false,
      });
    },

    /**
     * Creates a new pilot and sets `currentPilot`.
     *
     * @param pilot The pilot attributes.
     * @throws If an HTTP error occurs.
     */

    async signUp(pilot: PilotJSONUp): Promise<Result<void, Errors>> {
      const auth = useAuthStore();
      const flights = useFlightsStore();

      auth.reset();

      try {
        const response = await requestJSON<Pilot>({
          method: "post",
          path: "/signup.json",
          body: { pilot },
        });
        const result = loadAPIResponseBodyOrReturnErrors(response);
        if (result.ok) {
          auth.setJWT(response.val.response);
          this.setCurrentPilot(result.val);

          flights.reset();
          return Ok.EMPTY;
        }
        return new Err(result.val);
      } catch (error) {
        this.reset();
        auth.reset();
        flights.reset();
        throw error;
      }
    },

    /**
     * Generates a reset-password email.
     *
     * @param email The pilot email address to send the reset-password link to.
     * @return A Result containing nothing if successful, or the validation errors
     * if failed.
     * @throws If an HTTP error occurs.
     */

    async forgotPassword(email: string): Promise<void> {
      const response = await request({
        method: "post",
        path: "/password_resets.json",
        body: { pilot: { email } },
      });
      ignoreResponseBody(response);
    },

    /**
     * Resets a pilot password using a token from a reset-password email.
     *
     * @param password The new pilot password.
     * @param confirmation The password confirmation.
     * @param token The token from the reset-password email.
     * @return A Result containing nothing if successful, or the validation errors
     * if failed.
     * @throws If an HTTP error occurs.
     */

    async resetPassword({
      password,
      confirmation,
      token,
    }: {
      password: string;
      confirmation: string;
      token: string;
    }): Promise<Result<void, Errors>> {
      const response: APIResponse<void> = await requestJSON({
        method: "PATCH",
        path: "/password_resets.json",
        body: {
          pilot: {
            password,
            password_confirmation: confirmation,
            reset_password_token: token,
          },
        },
      });
      return ignoreAPIResponseBodyOrReturnErrors(response);
    },

    /**
     * Loads the current pilot account to `currentPilot`. Does nothing if not
     * logged in.
     *
     * @throws If an HTTP error occurs.
     */

    async loadAccount(): Promise<void> {
      const auth = useAuthStore();

      if (!auth.loggedIn) return;

      this.$patch({
        currentPilot: null,
        currentPilotError: null,
        currentPilotLoading: true,
      });
      try {
        const response = await requestJSON<Pilot>({
          method: "GET",
          path: "/account.json",
        });
        if (response.ok) {
          const pilot = loadAPIResponseBodyOrThrowErrors(response);
          this.setCurrentPilot(pilot);
        }
      } catch (error) {
        this.$patch({
          currentPilot: null,
          currentPilotLoading: false,
          currentPilotError: anythingToError(error),
        });
        notifyBugsnag(error);
      }
    },

    /**
     * Update a Pilot account.
     *
     * @param pilot The new pilot information. Must include a `current_password`
     * attribute.
     * @return A Result containing nothing if successful, or the validation errors
     * if failed.
     * @throws If an HTTP error occurs.
     */

    async updateAccount(pilot: PilotJSONUp): Promise<Result<void, Errors>> {
      const auth = useAuthStore();

      const response = await requestJSON<Pilot>({
        method: "PATCH",
        path: "/account.json",
        body: { pilot },
      });
      const result = loadAPIResponseBodyOrReturnErrors(response);
      if (result.ok) {
        auth.setJWT(response.val.response);
        this.setCurrentPilot(pilot);
        return Ok.EMPTY;
      }
      return new Err(result.val);
    },

    /**
     * Deletes a Pilot.
     */

    async deleteAccount(): Promise<void> {
      const auth = useAuthStore();
      const flights = useFlightsStore();

      const response: Response = await request({
        method: "delete",
        path: "/account.json",
      });
      ignoreResponseBody(response);
      this.reset();
      auth.reset();
      flights.reset();
    },
  },
});
