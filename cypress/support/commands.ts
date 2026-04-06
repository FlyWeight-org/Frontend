/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />
/// <reference types="./commands" />

import '@testing-library/cypress/add-commands'
import 'setimmediate'
import PostalMime from 'postal-mime'

Cypress.Commands.add('login', () => {
  cy.session(
    'cypress-user',
    () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiHost')}/login.json`,
        body: {
          pilot: {
            email: 'cypress@example.com',
            password: 'supersecret',
            remember_me: false,
          },
        },
      }).then((response) => {
        const authorization = response.headers['authorization'] as string
        const jwt = authorization.replace(/^Bearer /, '')
        window.localStorage.setItem('JWT', jwt)
      })
    },
    {
      validate() {
        const jwt = window.localStorage.getItem('JWT')
        assert.isString(jwt)
        assert.isNotEmpty(jwt)
      },
    },
  )
  cy.visit('/')
  cy.findByTestId('flight-list').should('exist')
})

Cypress.Commands.add('lastEmail', () => {
  return cy
    .request({
      method: 'GET',
      url: `${Cypress.env('apiHost')}/__cypress__/last_email`,
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200) return Promise.resolve(null)
      return PostalMime.parse(response.body)
    })
})

Cypress.Commands.add('errorsFor', (field: string) =>
  cy.findAllByTestId('field-errors').filter(`[data-name=${field}]`),
)
