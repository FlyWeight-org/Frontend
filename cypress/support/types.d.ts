/// <reference types="cypress" />

import { ParsedMail } from "mailparser";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Uses the API to log in to the website and sets the JWT in Pinia.
       */
      login(): void;

      /**
       * Custom command to select DOM element by data-cy attribute.
       *
       * @param value The value of the `data-cy` attribute.
       * @return The element(s) matching that attribute.
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;

      /**
       * @return The contents of the last email sent by the back-end.
       */
      lastEmail(): Chainable<ParsedMail | null>;
    }
  }
}
