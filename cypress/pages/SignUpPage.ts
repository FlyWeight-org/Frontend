import { BasePage } from './BasePage'

export class SignUpPage extends BasePage {
  visit(): SignUpPage {
    cy.visit('/')
    cy.findByRole('tab', { name: /sign up/i }).click()
    return this
  }

  fillName(name: string): this {
    return this.wrap(cy.findByTestId('signup-name').type(name))
  }

  fillEmail(email: string): this {
    return this.wrap(cy.findByTestId('signup-email').type(email))
  }

  fillPassword(password: string): this {
    return this.wrap(cy.findByTestId('signup-password').type(password))
  }

  fillPasswordConfirmation(confirmation: string): this {
    return this.wrap(cy.findByTestId('signup-password-confirmation').type(confirmation))
  }

  submit(): this {
    return this.wrap(cy.findByTestId('signup-submit').click())
  }
}
