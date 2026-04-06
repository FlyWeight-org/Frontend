import { PassengerFlightPage } from '../pages/PassengerFlightPage'
import { FlightsListPage } from '../pages/FlightsListPage'

describe('as a passenger', () => {
  let passengerPage: PassengerFlightPage

  beforeEach(() => {
    passengerPage = new PassengerFlightPage().visit(Cypress.env('flightUUID'))
  })

  it('displays the unauthorized flight page', () => {
    passengerPage.unauthTitle().should('contain', 'Are you going on a flight with Cypress User on')
  })

  it('handles form errors', () => {
    passengerPage.fillName(' ')
    passengerPage.fillWeight('123')
    passengerPage.submit()

    cy.errorsFor('name').should('contain', 'can\u2019t be blank')
  })

  it('adds a passenger', () => {
    passengerPage.fillName('New Pax')
    passengerPage.fillWeight('123')
    passengerPage.fillBagsWeight('23')
    passengerPage.submit()

    passengerPage.finishedMessage().should('exist')

    cy.login()
    const flightsPage = new FlightsListPage()
    flightsPage.clickFirstFlight()

    cy.findAllByTestId('passenger-list-item').should('have.length', 2)
    cy.findAllByTestId('passenger-list-item')
      .last()
      .within(() => {
        cy.findByTestId('passenger-name').should('contain', 'New Pax')
        cy.findByTestId('passenger-weight').should('contain', '123')
        cy.findByTestId('passenger-bags-weight').should('contain', '23')
      })

    cy.findByTestId('total-weight').should('contain', '331 lb')
    cy.findByTestId('total-weight-breakdown').should(
      'contain',
      '(137 lb avg. passenger, 58 lb total cargo)',
    )
  })

  it('updates a passenger', () => {
    passengerPage.fillName('Example Passenger')
    passengerPage.fillWeight('123')
    passengerPage.fillBagsWeight('23')
    passengerPage.submit()

    passengerPage.finishedMessage().should('exist')

    cy.login()
    const flightsPage = new FlightsListPage()
    flightsPage.clickFirstFlight()

    cy.findAllByTestId('passenger-list-item').should('have.length', 1)
    cy.findAllByTestId('passenger-list-item')
      .last()
      .within(() => {
        cy.findByTestId('passenger-name').should('contain', 'Example Passenger')
        cy.findByTestId('passenger-weight').should('contain', '123')
        cy.findByTestId('passenger-bags-weight').should('contain', '23')
      })

    cy.findByTestId('total-weight').should('contain', '171 lb')
    cy.findByTestId('total-weight-breakdown').should(
      'contain',
      '(123 lb avg. passenger, 48 lb total cargo)',
    )
  })
})
