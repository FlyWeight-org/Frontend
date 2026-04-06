export class PassengerManifest {
  private root(): Cypress.Chainable {
    return cy.findByTestId('passenger-manifest')
  }

  clickAdd(): this {
    this.root().within(() => {
      cy.findByTestId('add-load').click()
    })
    return this
  }

  fillForm(name: string, weight: string, bagsWeight?: string): this {
    this.root().within(() => {
      cy.findByTestId('passenger-form').within(() => {
        cy.findByTestId('passenger-name').type(name)
        cy.findByTestId('passenger-weight').type(weight)
        if (bagsWeight) {
          cy.findByTestId('passenger-bags-weight').type(bagsWeight)
        }
        cy.findByTestId('passenger-submit').click()
      })
    })
    return this
  }

  passengerListItems(): Cypress.Chainable {
    return this.root().findAllByTestId('passenger-list-item')
  }

  errorsFor(field: string): Cypress.Chainable {
    return this.root().findAllByTestId('field-errors').filter(`[data-name=${field}]`)
  }

  noPassengersMessage(): Cypress.Chainable {
    return cy.findByTestId('no-passengers')
  }

  toggleEnabled(): this {
    cy.findByTestId('passenger-enabled').uncheck()
    return this
  }

  deletePassenger(): this {
    cy.findByTestId('passenger-delete').click({ force: true })
    return this
  }
}
