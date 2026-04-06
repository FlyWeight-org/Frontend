import { LoginPage, ForgotPasswordPage, ResetPasswordPage } from '../pages/LoginPage'
import { SignUpPage } from '../pages/SignUpPage'
import { NavBar } from '../components/NavBar'

describe('signing up', () => {
  let signUpPage: SignUpPage

  beforeEach(() => {
    signUpPage = new SignUpPage().visit()
  })

  it('handles validation errors', () => {
    signUpPage.fillName('Sancho Sample')
    signUpPage.fillEmail('sancho@example.com')
    signUpPage.fillPassword('supersecret')
    signUpPage.fillPasswordConfirmation('doesntmatch')
    signUpPage.submit()

    cy.errorsFor('password_confirmation').should('contain', 'doesn\u2019t match')
  })

  it('signs up a user', () => {
    signUpPage.fillName('Sancho Sample')
    signUpPage.fillEmail('sancho@example.com')
    signUpPage.fillPassword('supersecret')
    signUpPage.fillPasswordConfirmation('supersecret')
    signUpPage.submit()

    cy.findByTestId('no-flights').should('exist')
  })
})

describe('logging in', () => {
  let loginPage: LoginPage

  beforeEach(() => {
    loginPage = new LoginPage().visit()
  })

  it('does not authenticate an invalid login', () => {
    loginPage.fillEmail('cypress@example.com')
    loginPage.fillPassword('wrongpassword')
    loginPage.submit()

    loginPage.loginError().should('contain', 'Incorrect email or password')
  })

  it('authenticates a valid login', () => {
    const flightsPage = loginPage.loginAs('cypress@example.com', 'supersecret')

    flightsPage.flightList().should('exist')
  })
})

describe('forgot password', () => {
  let loginPage: LoginPage

  beforeEach(() => {
    loginPage = new LoginPage().visit()
  })

  it('does not send an email for an unknown email', () => {
    const forgotPage = loginPage.clickForgotPassword()
    forgotPage.fillEmail('unknown@example.com')
    forgotPage.submit()

    forgotPage.successMessage().should('exist')
    cy.lastEmail().should('be.null')
  })

  context('known email', () => {
    let forgotPage: ForgotPasswordPage

    beforeEach(() => {
      forgotPage = loginPage.clickForgotPassword()
      forgotPage.fillEmail('cypress@example.com')
      forgotPage.submit()
    })

    it("shows an error if the password doesn't match the confirmation", () => {
      forgotPage.successMessage().should('exist')
      cy.lastEmail()
        .its('html')
        .then((email: string) => {
          const url = /"http:\/\/127\.0\.0\.1:4173(.+?)"/.exec(email)![1]
          const resetPage = new ResetPasswordPage().visit(url)

          resetPage.fillPassword('newpassword')
          resetPage.fillPasswordConfirmation('doesntmatch')
          resetPage.submit()

          cy.errorsFor('password_confirmation').should('contain', 'doesn\u2019t match')
        })
    })

    it('resets the password', () => {
      forgotPage.successMessage().should('exist')
      cy.lastEmail()
        .its('html')
        .then((email: string) => {
          const url = /"http:\/\/127\.0\.0\.1:4173(.+?)"/.exec(email)![1]
          const resetPage = new ResetPasswordPage().visit(url)

          resetPage.fillPassword('newpassword')
          resetPage.fillPasswordConfirmation('newpassword')
          resetPage.submit()

          resetPage.successMessage().should('contain', 'Your password has been changed.')

          const newLoginPage = new LoginPage().visit()
          const flightsPage = newLoginPage.loginAs('cypress@example.com', 'newpassword')

          flightsPage.flightList().should('exist')
        })
    })
  })
})

describe('logging out', () => {
  beforeEach(() => {
    cy.login()
  })

  it('logs the user out', () => {
    const nav = new NavBar()
    nav.clickLogout()

    nav.logoutLink().should('not.exist')
    cy.findByTestId('login-email').should('exist')
  })
})
