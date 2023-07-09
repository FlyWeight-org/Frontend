/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

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

export {}
