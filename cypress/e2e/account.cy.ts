describe('Account page', () => {
  beforeEach(() => {
    cy.login()
    cy.findByTestId('nav-account').click()
  })

  context('editing account', () => {
    it('displays errors', () => {
      cy.findByTestId('account-name').clear()
      cy.findByTestId('account-name').type(' ')
      cy.findByTestId('account-password').type('supersecret')
      cy.findByTestId('account-submit').click()

      cy.errorsFor('name').should('contain', 'can’t be blank')
      cy.findByTestId('account-success').should('not.exist')
    })

    it('requires the user\'s password', () => {
      cy.findByTestId('account-name').clear()
      cy.findByTestId('account-name').type(' ')
      cy.findByTestId('account-password').type('wrongpassword')
      cy.findByTestId('account-submit').click()

      cy.errorsFor('current_password').should('contain', 'invalid')
      cy.findByTestId('account-success').should('not.exist')
    })

    it('updates the user\'s account', () => {
      cy.findByTestId('account-name').clear()
      cy.findByTestId('account-name').type('New Name')
      cy.findByTestId('account-password').type('supersecret')
      cy.findByTestId('account-submit').click()

      cy.findByTestId('account-success').should('exist')
    })
  })

  context('changing password', () => {
    it('requires the user\'s password', () => {
      cy.findByTestId('account-password').type('wrongpassword')
      cy.findByTestId('account-new-password').type('newpassword')
      cy.findByTestId('account-new-password-confirmation').type('newpassword')
      cy.findByTestId('account-submit').click()

      cy.errorsFor('current_password').should('contain', 'invalid')
      cy.findByTestId('account-success').should('not.exist')
    })

    it('does not update the password if the confirmation doesn\'t match', () => {
      cy.findByTestId('account-password').type('supersecret')
      cy.findByTestId('account-new-password').type('newpassword')
      cy.findByTestId('account-new-password-confirmation').type('doesntmatch')
      cy.findByTestId('account-submit').click()

      cy.errorsFor('password_confirmation').should('contain', 'doesn’t match')
      cy.findByTestId('account-success').should('not.exist')
    })

    it('changes the user\'s password', () => {
      cy.findByTestId('account-password').type('supersecret')
      cy.findByTestId('account-new-password').type('newpassword')
      cy.findByTestId('account-new-password-confirmation').type('newpassword')
      cy.findByTestId('account-submit').click()

      cy.findByTestId('account-success').should('exist')

      cy.findByTestId('nav-logout').click()
      cy.findByTestId('login-email').type('cypress@example.com')
      cy.findByTestId('login-password').type('newpassword')
      cy.findByTestId('login-submit').click()
      cy.findByTestId('flight-list').should('exist')
    })
  })
})
