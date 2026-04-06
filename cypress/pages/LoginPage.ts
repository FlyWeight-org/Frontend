import { BasePage } from './BasePage'
import { FlightsListPage } from './FlightsListPage'

export class LoginPage extends BasePage {
  visit(): LoginPage {
    return this.wrap(cy.visit('/')) as LoginPage
  }

  fillEmail(email: string): this {
    return this.wrap(cy.findByTestId('login-email').type(email))
  }

  fillPassword(password: string): this {
    return this.wrap(cy.findByTestId('login-password').type(password))
  }

  submit(): this {
    return this.wrap(cy.findByTestId('login-submit').click())
  }

  loginError(): Cypress.Chainable {
    return cy.findByTestId('login-error')
  }

  clickForgotPassword(): ForgotPasswordPage {
    cy.findByTestId('forgot-password-link').click()
    return new ForgotPasswordPage()
  }

  loginAs(email: string, password: string): FlightsListPage {
    this.fillEmail(email)
    this.fillPassword(password)
    this.submit()
    return new FlightsListPage()
  }
}

export class ForgotPasswordPage extends BasePage {
  fillEmail(email: string): this {
    return this.wrap(cy.findByTestId('forgot-password-email').type(email))
  }

  submit(): this {
    return this.wrap(cy.findByTestId('forgot-password-submit').click())
  }

  successMessage(): Cypress.Chainable {
    return cy.findByTestId('forgot-password-success')
  }
}

export class ResetPasswordPage extends BasePage {
  fillPassword(password: string): this {
    return this.wrap(cy.findByTestId('reset-password-password').type(password))
  }

  fillPasswordConfirmation(confirmation: string): this {
    return this.wrap(cy.findByTestId('reset-password-password-confirmation').type(confirmation))
  }

  submit(): this {
    return this.wrap(cy.findByTestId('reset-password-submit').click())
  }

  successMessage(): Cypress.Chainable {
    return cy.findByTestId('reset-password-success')
  }
}
