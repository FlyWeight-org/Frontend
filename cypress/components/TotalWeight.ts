export class TotalWeight {
  total(): Cypress.Chainable {
    return cy.findByTestId('total-weight')
  }

  breakdown(): Cypress.Chainable {
    return cy.findByTestId('total-weight-breakdown')
  }
}
