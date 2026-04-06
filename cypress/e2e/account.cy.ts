import { AccountPage } from '../pages/AccountPage'
import { NavBar } from '../components/NavBar'
import { LoginPage } from '../pages/LoginPage'

describe('Account page', () => {
  let accountPage: AccountPage

  beforeEach(() => {
    cy.login()
    const nav = new NavBar()
    accountPage = nav.clickAccount()
  })

  context('editing account', () => {
    it('displays errors', () => {
      accountPage.clearAndFillName(' ')
      accountPage.fillCurrentPassword('supersecret')
      accountPage.submit()

      cy.errorsFor('name').should('contain', 'can\u2019t be blank')
      accountPage.successMessage().should('not.exist')
    })

    it("requires the user's password", () => {
      accountPage.clearAndFillName(' ')
      accountPage.fillCurrentPassword('wrongpassword')
      accountPage.submit()

      cy.errorsFor('current_password').should('contain', 'invalid')
      accountPage.successMessage().should('not.exist')
    })

    it("updates the user's account", () => {
      accountPage.clearAndFillName('New Name')
      accountPage.fillCurrentPassword('supersecret')
      accountPage.submit()

      accountPage.successMessage().should('exist')
    })
  })

  context('changing password', () => {
    it("requires the user's password", () => {
      accountPage.fillCurrentPassword('wrongpassword')
      accountPage.fillNewPassword('newpassword')
      accountPage.fillNewPasswordConfirmation('newpassword')
      accountPage.submit()

      cy.errorsFor('current_password').should('contain', 'invalid')
      accountPage.successMessage().should('not.exist')
    })

    it("does not update the password if the confirmation doesn't match", () => {
      accountPage.fillCurrentPassword('supersecret')
      accountPage.fillNewPassword('newpassword')
      accountPage.fillNewPasswordConfirmation('doesntmatch')
      accountPage.submit()

      cy.errorsFor('password_confirmation').should('contain', 'doesn\u2019t match')
      accountPage.successMessage().should('not.exist')
    })

    it("changes the user's password", () => {
      accountPage.fillCurrentPassword('supersecret')
      accountPage.fillNewPassword('newpassword')
      accountPage.fillNewPasswordConfirmation('newpassword')
      accountPage.submit()

      accountPage.successMessage().should('exist')

      const nav = new NavBar()
      nav.clickLogout()

      const loginPage = new LoginPage()
      loginPage.fillEmail('cypress@example.com')
      loginPage.fillPassword('newpassword')
      loginPage.submit()

      cy.findByTestId('flight-list').should('exist')
    })
  })
})
