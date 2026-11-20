import { test, expect } from './fixtures'

// Passkey registration and login, driven by Chromium's CDP virtual
// authenticator (ctap2, internal transport, user verification on). The
// backend's WebAuthn RP is the frontend's host, so the suite serves the
// frontend from localhost: browsers reject an IP address as an RP ID.

test.describe('Passkeys: register on the account page, then passwordless login', () => {
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== 'chromium', 'The CDP virtual authenticator is Chromium-only.')
  })

  test('registers a passkey and logs in with it after logging out', async ({
    page,
    navBar,
    loggedInPage: _login,
    resetDatabase: _reset,
  }) => {
    const client = await page.context().newCDPSession(page)
    await client.send('WebAuthn.enable')
    await client.send('WebAuthn.addVirtualAuthenticator', {
      options: {
        protocol: 'ctap2',
        transport: 'internal',
        hasResidentKey: true,
        hasUserVerification: true,
        isUserVerified: true,
        automaticPresenceSimulation: true,
      },
    })

    // Register the passkey (Rodauth requires the password).
    const accountPage = await navBar.clickAccount()
    await accountPage.addPasskey('Virtual authenticator', 'supersecret')
    await expect(accountPage.passkeysSuccessMessage()).toBeVisible()
    await expect(accountPage.passkeyLabel()).toHaveText('Virtual authenticator')

    // The login view starts a conditional-UI (autofill) ceremony on mount,
    // which the virtual authenticator completes without a password.
    await navBar.clickLogout()
    await expect(page.getByTestId('flight-list')).toBeVisible()
    await expect(navBar.logoutLink()).toBeVisible()
  })
})
