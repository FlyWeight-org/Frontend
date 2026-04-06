import { BasePage } from './BasePage'

export class FlightShowPage extends BasePage {
  authorizedFlight(): Cypress.Chainable {
    return cy.findByTestId('authorized-flight')
  }

  fillDate(): this {
    cy.findByTestId('flight-date').click()
    cy.get('.dp__calendar_item:not([aria-disabled])').first().click()
    return this.wrap(cy.get('.dp__action_select').click())
  }

  fillDescription(description: string): this {
    return this.wrap(cy.findByTestId('flight-description').type(description))
  }

  clearAndFillDescription(description: string): this {
    cy.findByTestId('flight-description').clear()
    return this.wrap(cy.findByTestId('flight-description').type(description))
  }

  submitFlight(): this {
    return this.wrap(cy.findByTestId('flight-submit').click())
  }

  deleteFlight(): this {
    return this.wrap(cy.findByTestId('delete-flight').click())
  }

  flightDescription(): Cypress.Chainable {
    return cy.findByTestId('flight-description')
  }
}
