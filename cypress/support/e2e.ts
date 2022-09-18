import "./commands";
import "cypress-watch-and-reload/support";

beforeEach(() => {
  cy.request("GET", `${Cypress.env("apiHost")}/__cypress__/reset`).then(
    (response) => {
      Cypress.env("flightUUID", response.body);
    }
  );
});
