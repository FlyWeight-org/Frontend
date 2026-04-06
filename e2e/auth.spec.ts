import { test, expect, fetchLastEmail, extractEmailPath } from './fixtures'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { LoginPage } from './pages/LoginPage'

test.describe('signing up', () => {
  test('handles validation errors', async ({ page, signUpPage, resetDatabase: _reset }) => {
    await signUpPage.visit()
    await signUpPage.fillName('Sancho Sample')
    await signUpPage.fillEmail('sancho@example.com')
    await signUpPage.fillPassword('supersecret')
    await signUpPage.fillPasswordConfirmation('doesntmatch')
    await signUpPage.submit()

    await expect(
      page.locator('[data-testid="field-errors"][data-name="password_confirmation"]'),
    ).toContainText('doesn\u2019t match')
  })

  test('signs up a user', async ({ page, signUpPage, resetDatabase: _reset }) => {
    await signUpPage.visit()
    await signUpPage.fillName('Sancho Sample')
    await signUpPage.fillEmail('sancho@example.com')
    await signUpPage.fillPassword('supersecret')
    await signUpPage.fillPasswordConfirmation('supersecret')
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

    await expect(loginPage.loginError()).toContainText('Incorrect email or password')
  })

  test('authenticates a valid login', async ({ loginPage, resetDatabase: _reset }) => {
    await loginPage.visit()
    const flightsPage = await loginPage.loginAs('cypress@example.com', 'supersecret')

    await expect(flightsPage.flightList()).toBeVisible()
  })
})

test.describe('forgot password', () => {
  test('does not send an email for an unknown email', async ({
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

      const url = extractEmailPath(email!.html, 'http://127.0.0.1:4173')
      const resetPage = new ResetPasswordPage(page)
      await resetPage.visit(url)

      await resetPage.fillPassword('newpassword')
      await resetPage.fillPasswordConfirmation('doesntmatch')
      await resetPage.submit()

      await expect(
        page.locator('[data-testid="field-errors"][data-name="password_confirmation"]'),
      ).toContainText('doesn\u2019t match')
    })

    test('resets the password', async ({ page, loginPage, resetDatabase: _reset }) => {
      await loginPage.visit()
      const forgotPage = await loginPage.clickForgotPassword()
      await forgotPage.fillEmail('cypress@example.com')
      await forgotPage.submit()

      await expect(forgotPage.successMessage()).toBeVisible()

      const email = await fetchLastEmail()
      expect(email).not.toBeNull()

      const url = extractEmailPath(email!.html, 'http://127.0.0.1:4173')
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
