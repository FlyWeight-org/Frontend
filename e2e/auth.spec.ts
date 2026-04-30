import { test, expect, fetchLastEmail, extractEmailPath } from './fixtures'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { LoginPage } from './pages/LoginPage'

test.describe('signing up', () => {
  test('handles validation errors', async ({ page, signUpPage, resetDatabase: _reset }) => {
    await signUpPage.visit()
    await signUpPage.fillName('Sancho Sample')
    await signUpPage.fillEmail('sancho@example.com')
    await signUpPage.fillPassword('x') // too short
    await signUpPage.submit()

    await expect(page.locator('[data-testid="field-errors"][data-name="password"]')).toBeVisible()
  })

  test('signs up a user', async ({ page, signUpPage, resetDatabase: _reset }) => {
    await signUpPage.visit()
    await signUpPage.fillName('Sancho Sample')
    await signUpPage.fillEmail('sancho@example.com')
    await signUpPage.fillPassword('supersecret')
    await signUpPage.submit()

    await expect(page.getByTestId('no-flights')).toBeVisible()
  })
})

test.describe('logging in', () => {
  test('does not authenticate an invalid login', async ({ loginPage, resetDatabase: _reset }) => {
    await loginPage.visit()
    await loginPage.fillEmail('cypress@example.com')
    await loginPage.fillPassword('wrongpassword')
    await loginPage.submit()

    await expect(loginPage.loginError()).toBeVisible()
  })

  test('authenticates a valid login', async ({ loginPage, resetDatabase: _reset }) => {
    await loginPage.visit()
    const flightsPage = await loginPage.loginAs('cypress@example.com', 'supersecret')

    await expect(flightsPage.flightList()).toBeVisible()
  })
})

test.describe('forgot password', () => {
  test('shows success for unknown email (no enumeration)', async ({
    loginPage,
    resetDatabase: _reset,
  }) => {
    await loginPage.visit()
    const forgotPage = await loginPage.clickForgotPassword()
    await forgotPage.fillEmail('unknown@example.com')
    await forgotPage.submit()

    await expect(forgotPage.successMessage()).toBeVisible()

    const email = await fetchLastEmail()
    expect(email).toBeNull()
  })

  test.describe('known email', () => {
    test("shows an error if the password doesn't match the confirmation", async ({
      page,
      loginPage,
      resetDatabase: _reset,
    }) => {
      await loginPage.visit()
      const forgotPage = await loginPage.clickForgotPassword()
      await forgotPage.fillEmail('cypress@example.com')
      await forgotPage.submit()

      await expect(forgotPage.successMessage()).toBeVisible()

      const email = await fetchLastEmail()
      expect(email).not.toBeNull()

      const url = extractEmailPath(email!, 'http://127.0.0.1:4173')
      const resetPage = new ResetPasswordPage(page)
      await resetPage.visit(url)

      await resetPage.fillPassword('newpassword')
      await resetPage.fillPasswordConfirmation('doesntmatch')
      await resetPage.submit()

      await expect(
        page.locator('[data-testid="field-errors"][data-name="password_confirmation"]'),
      ).toContainText('do not match')
    })

    test('resets the password', async ({ page, loginPage, resetDatabase: _reset }) => {
      await loginPage.visit()
      const forgotPage = await loginPage.clickForgotPassword()
      await forgotPage.fillEmail('cypress@example.com')
      await forgotPage.submit()

      await expect(forgotPage.successMessage()).toBeVisible()

      const email = await fetchLastEmail()
      expect(email).not.toBeNull()

      const url = extractEmailPath(email!, 'http://127.0.0.1:4173')
      const resetPage = new ResetPasswordPage(page)
      await resetPage.visit(url)

      await resetPage.fillPassword('newpassword')
      await resetPage.fillPasswordConfirmation('newpassword')
      await resetPage.submit()

      await expect(resetPage.successMessage()).toContainText('Your password has been changed.')

      const newLoginPage = new LoginPage(page)
      await newLoginPage.visit()
      const flightsPage = await newLoginPage.loginAs('cypress@example.com', 'newpassword')

      await expect(flightsPage.flightList()).toBeVisible()
    })
  })
})

test.describe('turnstile_token in request bodies', () => {
  // Cloudflare's test site key (1x00000000000000000000AA) always passes, so the
  // widget produces a token without user interaction. We intercept the auth
  // requests and assert the token is in the body. Live runs through these flows
  // require Backend B4 (server-side Turnstile validation) to be merged.

  async function readJSONBody(request: import('@playwright/test').Request) {
    const data = request.postData()
    return data ? JSON.parse(data) : null
  }

  test('signup request includes turnstile_token', async ({
    page,
    signUpPage,
    resetDatabase: _reset,
  }) => {
    await signUpPage.visit()
    await signUpPage.fillName('Sancho Sample')
    await signUpPage.fillEmail('sancho-turnstile@example.com')
    await signUpPage.fillPassword('supersecret')

    await page.getByTestId('signup-submit').waitFor({ state: 'attached' })
    const requestPromise = page.waitForRequest(
      (req) => req.url().endsWith('/signup') && req.method() === 'POST',
    )
    await signUpPage.submit()
    const request = await requestPromise
    const body = await readJSONBody(request)

    expect(body).toHaveProperty('turnstile_token')
    expect(typeof body.turnstile_token).toBe('string')
    expect(body.turnstile_token.length).toBeGreaterThan(0)
  })

  test('login request includes turnstile_token', async ({
    page,
    loginPage,
    resetDatabase: _reset,
  }) => {
    await loginPage.visit()
    await loginPage.fillEmail('cypress@example.com')
    await loginPage.fillPassword('supersecret')

    const requestPromise = page.waitForRequest(
      (req) => req.url().endsWith('/login') && req.method() === 'POST',
    )
    await loginPage.submit()
    const request = await requestPromise
    const body = await readJSONBody(request)

    expect(body).toHaveProperty('turnstile_token')
    expect(typeof body.turnstile_token).toBe('string')
    expect(body.turnstile_token.length).toBeGreaterThan(0)
  })

  test('forgot-password request includes turnstile_token', async ({
    page,
    loginPage,
    resetDatabase: _reset,
  }) => {
    await loginPage.visit()
    const forgotPage = await loginPage.clickForgotPassword()
    await forgotPage.fillEmail('cypress@example.com')

    const requestPromise = page.waitForRequest(
      (req) => req.url().endsWith('/password-resets') && req.method() === 'POST',
    )
    await forgotPage.submit()
    const request = await requestPromise
    const body = await readJSONBody(request)

    expect(body).toHaveProperty('turnstile_token')
    expect(typeof body.turnstile_token).toBe('string')
    expect(body.turnstile_token.length).toBeGreaterThan(0)
  })
})

test.describe('logging out', () => {
  test('logs the user out', async ({
    page,
    navBar,
    loggedInPage: _login,
    resetDatabase: _reset,
  }) => {
    await navBar.clickLogout()

    await expect(navBar.logoutLink()).not.toBeVisible()
    await expect(page.getByTestId('login-email')).toBeVisible()
  })
})
