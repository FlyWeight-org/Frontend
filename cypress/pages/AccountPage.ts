import { BasePage } from './BasePage'

export class AccountPage extends BasePage {
  clearAndFillName(name: string): this {
    cy.findByTestId('account-name').clear()
    return this.wrap(cy.findByTestId('account-name').type(name))
  }

  fillCurrentPassword(password: string): this {
    return this.wrap(cy.findByTestId('account-password').type(password))
  }

  fillNewPassword(password: string): this {
    return this.wrap(cy.findByTestId('account-new-password').type(password))
  }

  fillNewPasswordConfirmation(confirmation: string): this {
    return this.wrap(cy.findByTestId('account-new-password-confirmation').type(confirmation))
  }

  submit(): this {
    return this.wrap(cy.findByTestId('account-submit').click())
  }

  successMessage(): Cypress.Chainable {
    return cy.findByTestId('account-success')
  }
}
