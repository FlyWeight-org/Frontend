describe('signing up', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.findByTestId('signup-tab').click()
  })

  it('handles validation errors', () => {
    cy.findByTestId('signup-name').type('Sancho Sample')
    cy.findByTestId('signup-email').type('sancho@example.com')
    cy.findByTestId('signup-password').type('supersecret')
    cy.findByTestId('signup-password-confirmation').type('doesntmatch')
    cy.findByTestId('signup-submit').click()

    cy.errorsFor('password_confirmation').should('contain', 'doesn’t match')
  })

  it('signs up a user', () => {
    cy.findByTestId('signup-name').type('Sancho Sample')
    cy.findByTestId('signup-email').type('sancho@example.com')
    cy.findByTestId('signup-password').type('supersecret')
    cy.findByTestId('signup-password-confirmation').type('supersecret')
    cy.findByTestId('signup-submit').click()

    cy.findByTestId('no-flights').should('exist')
  })
})

describe('logging in', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('does not authenticate an invalid login', () => {
    cy.findByTestId('login-email').type('cypress@example.com')
    cy.findByTestId('login-password').type('wrongpassword')
    cy.findByTestId('login-submit').click()

    cy.findByTestId('login-error').should(
      'contain',
      'Incorrect email or password'
    )
  })

  it('authenticates a valid login', () => {
    cy.findByTestId('login-email').type('cypress@example.com')
    cy.findByTestId('login-password').type('supersecret')
    cy.findByTestId('login-submit').click()

    cy.findByTestId('flight-list').should('exist')
  })
})

describe('forgot password', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('does not send an email for an unknown email', () => {
    cy.findByTestId('forgot-password-link').click()
    cy.findByTestId('forgot-password-email').type('unknown@example.com')
    cy.findByTestId('forgot-password-submit').click()

    cy.findByTestId('forgot-password-success').should('exist')
    cy.lastEmail().should('be.null')
  })

  context('known email', () => {
    beforeEach(() => {
      cy.findByTestId('forgot-password-link').click()
      cy.findByTestId('forgot-password-email').type('cypress@example.com')
      cy.findByTestId('forgot-password-submit').click()
    })

    it('shows an error if the password doesn\'t match the confirmation', () => {
      cy.findByTestId('forgot-password-success').should('exist')
      cy.lastEmail()
        .its('html')
        .then((email: string) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const url = email.match(/"http:\/\/127\.0\.0\.1:4173(.+?)"/)![1]
          cy.visit(url)

          cy.findByTestId('reset-password-password').type('newpassword')
          cy.findByTestId('reset-password-password-confirmation').type('doesntmatch')
          cy.findByTestId('reset-password-submit').click()

          cy.errorsFor('password_confirmation').should('contain', 'doesn’t match')
        })
    })

    it('resets the password', () => {
      cy.findByTestId('forgot-password-success').should('exist')
      cy.lastEmail()
        .its('html')
        .then((email: string) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const url = email.match(/"http:\/\/127\.0\.0\.1:4173(.+?)"/)![1]
          cy.visit(url)

          cy.findByTestId('reset-password-password').type('newpassword')
          cy.findByTestId('reset-password-password-confirmation').type('newpassword')
          cy.findByTestId('reset-password-submit').click()

          cy.findByTestId('reset-password-success').should(
            'contain',
            'Your password has been changed.'
          )

          cy.visit('/')
          cy.findByTestId('login-email').type('cypress@example.com')
          cy.findByTestId('login-password').type('newpassword')
          cy.findByTestId('login-submit').click()

          cy.findByTestId('flight-list').should('exist')
        })
    })
  })
})

describe('logging out', () => {
  beforeEach(() => {
    cy.login()
  })

  it('logs the user out', () => {
    cy.findByTestId('nav-logout').click()
    cy.findByTestId('nav-logout').should('not.exist')
    cy.findByTestId('login-email').should('exist')
  })
})
