export class BasePage {
  protected wrap(chainable: Cypress.Chainable): this {
    chainable.should(() => {
      /* ensure the chain resolves */
    })
    return this
  }

  visit(path: string): this {
    return this.wrap(cy.visit(path))
  }
}
