import { AccountPage } from '../pages/AccountPage'
import { FlightsListPage } from '../pages/FlightsListPage'
import { FlightShowPage } from '../pages/FlightShowPage'
import { LoginPage } from '../pages/LoginPage'

export class NavBar {
  clickAccount(): AccountPage {
    cy.findByRole('link', { name: /my account/i }).click()
    return new AccountPage()
  }

  clickAddFlight(): FlightShowPage {
    cy.findByRole('link', { name: /add a flight/i }).click()
    return new FlightShowPage()
  }

  clickMyFlights(): FlightsListPage {
    cy.findByRole('link', { name: /my flights/i }).click()
    return new FlightsListPage()
  }

  clickLogout(): LoginPage {
    cy.findByRole('link', { name: /log out/i }).click()
    return new LoginPage()
  }

  logoutLink(): Cypress.Chainable {
    return cy.findByTestId('nav-logout')
  }
}
