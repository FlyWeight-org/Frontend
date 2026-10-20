import type { APIRequestContext, Page } from '@playwright/test'
import { createHash } from 'node:crypto'
import { API_HOST } from '../fixtures'
import type { AccountPage } from '../pages/AccountPage'

/** The name the test assistant registers under. */
export const ASSISTANT_NAME = 'Test assistant'
const CALLBACK = 'https://assistant.example/callback'
const CODE_VERIFIER = 'v'.repeat(43)

async function registerAssistant(request: APIRequestContext): Promise<string> {
  const registration = await request.post(`${API_HOST}/oauth/register`, {
    data: {
      client_name: ASSISTANT_NAME,
      redirect_uris: [CALLBACK],
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
    },
  })
  if (!registration.ok()) throw new Error(`Registration failed: ${registration.status()}`)
  const client: { client_id: string } = await registration.json()
  return client.client_id
}

function consentPath(clientID: string): string {
  const query = new URLSearchParams({
    client_id: clientID,
    redirect_uri: CALLBACK,
    response_type: 'code',
    resource: `${API_HOST}/mcp`,
    scope: 'flights:read flights:write',
    state: 'e2e-state',
    code_challenge_method: 'S256',
    code_challenge: createHash('sha256').update(CODE_VERIFIER).digest('base64url'),
  })
  return `/connect?${query}`
}

/**
 * Registers the test assistant, stubs its callback page, and returns the
 * consent path for its authorization request.
 */
export async function prepareAssistantAuthorization(
  page: Page,
  request: APIRequestContext,
): Promise<string> {
  await page.route(`${CALLBACK}**`, (route) =>
    route.fulfill({ contentType: 'text/html', body: '<h1>Assistant connected</h1>' }),
  )
  return consentPath(await registerAssistant(request))
}

async function exchangeCode(
  request: APIRequestContext,
  clientID: string,
  code: string,
): Promise<void> {
  const response = await request.post(`${API_HOST}/oauth/token`, {
    form: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: CALLBACK,
      client_id: clientID,
      code_verifier: CODE_VERIFIER,
      resource: `${API_HOST}/mcp`,
    },
  })
  if (!response.ok()) throw new Error(`Token exchange failed: ${response.status()}`)
}

function queryParam(url: string, name: string): string {
  const value = new URL(url).searchParams.get(name)
  if (!value) throw new Error(`Missing ${name} in ${url}`)
  return value
}

/**
 * Approves the pending authorization request on the consent screen, then
 * exchanges the returned code for a token as the assistant would.
 */
export async function connectAssistant(page: Page, request: APIRequestContext): Promise<void> {
  const clientID = queryParam(page.url(), 'client_id')
  await page.getByRole('button', { name: 'Allow access', exact: true }).click()
  await page.waitForURL(`${CALLBACK}**`)
  await exchangeCode(request, clientID, queryParam(page.url(), 'code'))
}

/** Revokes the test assistant from the account page, accepting the confirmation. */
export async function revokeAssistant(page: Page, accountPage: AccountPage): Promise<void> {
  await page.goto('/account')
  page.once('dialog', (dialog) => void dialog.accept())
  await accountPage.revokeAssistantButton(ASSISTANT_NAME).click()
}
