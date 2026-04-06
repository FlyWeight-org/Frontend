import { BasePage } from './BasePage'
import { FlightShowPage } from './FlightShowPage'

export class FlightsListPage extends BasePage {
  flightList(): Cypress.Chainable {
    return cy.findAllByTestId('flight-list')
  }

  noFlightsMessage(): Cypress.Chainable {
    return cy.findByTestId('no-flights')
  }

  clickFirstFlight(): FlightShowPage {
    cy.findByTestId('flight-list-item').click()
    return new FlightShowPage()
  }
}
