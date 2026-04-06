export class CargoManifest {
  private root(): Cypress.Chainable {
    return cy.findByTestId('cargo-manifest')
  }

  clickAdd(): this {
    this.root().within(() => {
      cy.findByTestId('add-load').click()
    })
    return this
  }

  fillForm(name: string, weight: string): this {
    this.root().within(() => {
      cy.findByTestId('cargo-form').within(() => {
        cy.findByTestId('cargo-name').type(name)
        cy.findByTestId('cargo-weight').type(weight)
        cy.findByTestId('cargo-submit').click()
      })
    })
    return this
  }

  cargoListItems(): Cypress.Chainable {
    return this.root().findAllByTestId('cargo-list-item')
  }

  errorsFor(field: string): Cypress.Chainable {
    return this.root().findAllByTestId('field-errors').filter(`[data-name=${field}]`)
  }

  noCargoMessage(): Cypress.Chainable {
    return cy.findByTestId('no-cargo')
  }

  toggleEnabled(): this {
    cy.findByTestId('cargo-enabled').uncheck()
    return this
  }

  deleteCargo(): this {
    cy.findByTestId('cargo-delete').click({ force: true })
    return this
  }
}
