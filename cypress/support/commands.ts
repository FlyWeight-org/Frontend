/// <reference types="cypress" />

import "@testing-library/cypress/add-commands";

import 'setimmediate'
import { simpleParser } from "mailparser";

Cypress.Commands.add("login", () => {
  cy.visit("/");
  cy.dataCy("login-email").type("cypress@example.com");
  cy.dataCy("login-password").type("supersecret");
  cy.dataCy("login-submit").click();
  cy.dataCy("flight-list").should("exist");
});

Cypress.Commands.add("dataCy", (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add("lastEmail", () => {
  return cy
    .request({
      method: "GET",
      url: `${Cypress.env("apiHost")}/__cypress__/last_email`,
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200) return Promise.resolve(null);
      return simpleParser(response.body);
    });
});

export {};
