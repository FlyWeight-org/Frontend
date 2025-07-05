describe('as a passenger', () => {
  beforeEach(() => {
    cy.visit(`/flights/${Cypress.env('flightUUID')}`)
  })

  it('displays the unauthorized flight page', () => {
    cy.findByTestId('flight-unauth-title').should(
      'contain',
      'Are you going on a flight with Cypress User on'
    )
  })

  it('handles form errors', () => {
    cy.findByTestId('passenger-name').type(' ')
    cy.findByTestId('passenger-weight').type('123')
    cy.findByTestId('passenger-submit').click()

    cy.errorsFor('name').should('contain', 'can’t be blank')
  })

  it('adds a passenger', () => {
    cy.findByTestId('passenger-name').type('New Pax')
    cy.findByTestId('passenger-weight').type('123')
    cy.findByTestId('passenger-bags-weight').type('23')
    cy.findByTestId('passenger-submit').click()

    cy.findByTestId('flight-finished').should('exist')

    cy.login()
    cy.findByTestId('flight-list-item').click()
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
      '(137 lb avg. passenger, 58 lb total cargo)'
    )
  })

  it('updates a passenger', () => {
    cy.findByTestId('passenger-name').type('Example Passenger')
    cy.findByTestId('passenger-weight').type('123')
    cy.findByTestId('passenger-bags-weight').type('23')
    cy.findByTestId('passenger-submit').click()

    cy.findByTestId('flight-finished').should('exist')

    cy.login()
    cy.findByTestId('flight-list-item').click()
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
      '(123 lb avg. passenger, 48 lb total cargo)'
    )
  })
})
