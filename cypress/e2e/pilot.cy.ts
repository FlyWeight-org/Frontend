import { FlightsListPage } from '../pages/FlightsListPage'
import { FlightShowPage } from '../pages/FlightShowPage'
import { NavBar } from '../components/NavBar'
import { PassengerManifest } from '../components/PassengerManifest'
import { CargoManifest } from '../components/CargoManifest'
import { TotalWeight } from '../components/TotalWeight'

describe('as a pilot', () => {
  beforeEach(() => {
    cy.login()
  })

  context('viewing flights', () => {
    it('displays a list of flights', () => {
      const flightsPage = new FlightsListPage()
      flightsPage.flightList().should('have.length', 1)
    })
  })

  context('creating a flight', () => {
    let flightPage: FlightShowPage

    beforeEach(() => {
      const nav = new NavBar()
      flightPage = nav.clickAddFlight()
    })

    it.skip('displays errors', () => {
      cy.findByTestId('flight-date').click()
      flightPage.fillDescription('example flight description')
      flightPage.submitFlight()

      cy.errorsFor('date').should('contain', 'invalid')
    })

    it('creates a flight', () => {
      flightPage.fillDate()
      flightPage.fillDescription('example flight description')
      flightPage.submitFlight()

      flightPage.authorizedFlight().should('exist')
    })
  })

  context('editing a flight', () => {
    let flightPage: FlightShowPage

    beforeEach(() => {
      const flightsPage = new FlightsListPage()
      flightPage = flightsPage.clickFirstFlight()
    })

    it.skip('displays errors', () => {
      cy.findByTestId('flight-date').click()
      flightPage.submitFlight()

      cy.errorsFor('date').should('contain', 'invalid')
    })

    it('edits a flight', () => {
      flightPage.clearAndFillDescription('new description')
      flightPage.submitFlight()
      cy.reload()

      flightPage.flightDescription().should('have.value', 'new description')
    })
  })

  context('loads', () => {
    beforeEach(() => {
      const flightsPage = new FlightsListPage()
      flightsPage.clickFirstFlight()
    })

    context('passengers', () => {
      let passengerManifest: PassengerManifest
      let totalWeight: TotalWeight

      beforeEach(() => {
        passengerManifest = new PassengerManifest()
        totalWeight = new TotalWeight()
      })

      it('displays errors', () => {
        passengerManifest.clickAdd()
        passengerManifest.fillForm('New Pax', '0')

        passengerManifest.errorsFor('weight').should('contain', 'greater than 0')
      })

      it('adds a load', () => {
        passengerManifest.clickAdd()
        passengerManifest.fillForm('New Pax', '180', '25')

        passengerManifest.passengerListItems().should('have.length', 2)
        passengerManifest
          .passengerListItems()
          .last()
          .within(() => {
            cy.findByTestId('passenger-name').should('contain', 'New Pax')
            cy.findByTestId('passenger-weight').should('contain', '180')
            cy.findByTestId('passenger-bags-weight').should('contain', '25')
          })

        totalWeight.total().should('contain', '390 lb')
        totalWeight.breakdown().should('contain', '(165 lb avg. passenger, 60 lb total cargo)')
      })

      it('updates an existing load', () => {
        passengerManifest.clickAdd()
        passengerManifest.fillForm('Example Passenger', '180', '25')

        passengerManifest.passengerListItems().should('have.length', 1)
        cy.findByTestId('passenger-list-item').within(() => {
          cy.findByTestId('passenger-name').should('contain', 'Example Passenger')
          cy.findByTestId('passenger-weight').should('contain', '180')
          cy.findByTestId('passenger-bags-weight').should('contain', '25')
        })

        totalWeight.total().should('contain', '230 lb')
        totalWeight.breakdown().should('contain', '(180 lb avg. passenger, 50 lb total cargo)')
      })

      it('disables a load', () => {
        passengerManifest.toggleEnabled()

        totalWeight.total().should('contain', '25 lb')
        totalWeight.breakdown().should('not.exist')
      })

      it('removes a load', () => {
        passengerManifest.deletePassenger()

        passengerManifest.noPassengersMessage().should('exist')
        totalWeight.total().should('contain', '25 lb')
        totalWeight.breakdown().should('not.exist')
      })
    })

    context('cargo', () => {
      let cargoManifest: CargoManifest
      let totalWeight: TotalWeight

      beforeEach(() => {
        cargoManifest = new CargoManifest()
        totalWeight = new TotalWeight()
      })

      it('displays errors', () => {
        cargoManifest.clickAdd()
        cargoManifest.fillForm('New Cargo', '0')

        cargoManifest.errorsFor('bags_weight').should('contain', 'greater than 0')
      })

      it('adds a load', () => {
        cargoManifest.clickAdd()
        cargoManifest.fillForm('New Cargo', '50')

        cargoManifest.cargoListItems().should('have.length', 2)
        cargoManifest
          .cargoListItems()
          .last()
          .within(() => {
            cy.findByTestId('cargo-name').should('contain', 'New Cargo')
            cy.findByTestId('cargo-weight').should('contain', '50')
          })

        totalWeight.total().should('contain', '235 lb')
        totalWeight.breakdown().should('contain', '(150 lb avg. passenger, 85 lb total cargo)')
      })

      it('updates an existing load', () => {
        cargoManifest.clickAdd()
        cargoManifest.fillForm('Example Cargo', '50')

        cargoManifest.cargoListItems().should('have.length', 1)
        cy.findByTestId('cargo-list-item').within(() => {
          cy.findByTestId('cargo-name').should('contain', 'Example Cargo')
          cy.findByTestId('cargo-weight').should('contain', '50')
        })

        totalWeight.total().should('contain', '210 lb')
        totalWeight.breakdown().should('contain', '(150 lb avg. passenger, 60 lb total cargo)')
      })

      it('disables a load', () => {
        cargoManifest.toggleEnabled()

        totalWeight.total().should('contain', '160 lb')
        totalWeight.breakdown().should('contain', '(150 lb avg. passenger, 10 lb total cargo)')
      })

      it('removes a load', () => {
        cargoManifest.deleteCargo()

        cargoManifest.noCargoMessage().should('exist')
        totalWeight.total().should('contain', '160 lb')
        totalWeight.breakdown().should('contain', '(150 lb avg. passenger, 10 lb total cargo)')
      })
    })
  })

  context('deleting a flight', () => {
    let flightPage: FlightShowPage

    beforeEach(() => {
      const flightsPage = new FlightsListPage()
      flightPage = flightsPage.clickFirstFlight()
    })

    it('deletes a flight', () => {
      flightPage.deleteFlight()

      const flightsPage = new FlightsListPage()
      flightsPage.noFlightsMessage().should('exist')
    })
  })
})
