/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="./commands" />

import '@testing-library/cypress/add-commands'
import 'setimmediate'
import PostalMime from 'postal-mime'

Cypress.Commands.add('login', () => {
  cy.visit('/')
  cy.findByTestId('login-email').type('cypress@example.com')
  cy.findByTestId('login-password').type('supersecret')
  cy.findByTestId('login-submit').click()
  cy.findByTestId('flight-list').should('exist')
})

Cypress.Commands.add('lastEmail', () => {
  return cy
    .request({
      method: 'GET',
      url: `${Cypress.env('apiHost')}/__cypress__/last_email`,
      failOnStatusCode: false
    })
    .then((response) => {
      if (response.status !== 200) return Promise.resolve(null)
      return PostalMime.parse(response.body)
    })
})

Cypress.Commands.add('errorsFor', (field: string) =>
  cy.findAllByTestId('field-errors').filter(`[data-name=${field}]`)
)
