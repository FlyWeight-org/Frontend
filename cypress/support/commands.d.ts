/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />


import type { Email } from 'postal-mime'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Uses the API to log in to the website and sets the JWT in Pinia.
       */
      login(): void;

      /**
       * @return The contents of the last email sent by the back-end.
       */
      lastEmail(): Chainable<Promise<Email | null>>;

      /**
       * @param field The name of the field to get errors for.
       * @return The `<ul>` containing the errors for the field.
       */
      errorsFor(field: string): Chainable<Element>;
    }
  }
}

export {}
