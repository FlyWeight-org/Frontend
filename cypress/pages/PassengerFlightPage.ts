import { BasePage } from './BasePage'

export class PassengerFlightPage extends BasePage {
  visit(flightUUID: string): PassengerFlightPage {
    return this.wrap(cy.visit(`/flights/${flightUUID}`)) as PassengerFlightPage
  }

  unauthTitle(): Cypress.Chainable {
    return cy.findByTestId('flight-unauth-title')
  }

  fillName(name: string): this {
    return this.wrap(cy.findByTestId('passenger-name').type(name))
  }

  fillWeight(weight: string): this {
    return this.wrap(cy.findByTestId('passenger-weight').type(weight))
  }

  fillBagsWeight(weight: string): this {
    return this.wrap(cy.findByTestId('passenger-bags-weight').type(weight))
  }

  submit(): this {
    return this.wrap(cy.findByTestId('passenger-submit').click())
  }

  finishedMessage(): Cypress.Chainable {
    return cy.findByTestId('flight-finished')
  }
}
