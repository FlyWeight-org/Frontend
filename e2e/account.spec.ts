import { test, expect } from './fixtures'
import { LoginPage } from './pages/LoginPage'

test.describe('Account page', () => {
  test.describe('editing account', () => {
    test('displays errors', async ({
      page,
      navBar,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const accountPage = await navBar.clickAccount()
      await accountPage.clearAndFillName(' ')
      await accountPage.fillCurrentPassword('supersecret')
      await accountPage.submit()

      await expect(page.locator('[data-testid="field-errors"][data-name="name"]')).toContainText(
        'can\u2019t be blank',
      )
      await expect(accountPage.successMessage()).not.toBeVisible()
    })

    test("requires the user's password", async ({
      page,
      navBar,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const accountPage = await navBar.clickAccount()
      await accountPage.clearAndFillName(' ')
      await accountPage.fillCurrentPassword('wrongpassword')
      await accountPage.submit()

      await expect(
        page.locator('[data-testid="field-errors"][data-name="current_password"]'),
      ).toContainText('invalid')
      await expect(accountPage.successMessage()).not.toBeVisible()
    })

    test("updates the user's account", async ({
      navBar,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const accountPage = await navBar.clickAccount()
      await accountPage.clearAndFillName('New Name')
      await accountPage.fillCurrentPassword('supersecret')
      await accountPage.submit()

      await expect(accountPage.successMessage()).toBeVisible()
    })
  })

  test.describe('changing password', () => {
    test("requires the user's password", async ({
      page,
      navBar,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const accountPage = await navBar.clickAccount()
      await accountPage.fillCurrentPassword('wrongpassword')
      await accountPage.fillNewPassword('newpassword')
      await accountPage.fillNewPasswordConfirmation('newpassword')
      await accountPage.submit()

      await expect(
        page.locator('[data-testid="field-errors"][data-name="current_password"]'),
      ).toContainText('invalid')
      await expect(accountPage.successMessage()).not.toBeVisible()
    })

    test("does not update the password if the confirmation doesn't match", async ({
      page,
      navBar,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const accountPage = await navBar.clickAccount()
      await accountPage.fillCurrentPassword('supersecret')
      await accountPage.fillNewPassword('newpassword')
      await accountPage.fillNewPasswordConfirmation('doesntmatch')
      await accountPage.submit()

      await expect(
        page.locator('[data-testid="field-errors"][data-name="password_confirmation"]'),
      ).toContainText('doesn\u2019t match')
      await expect(accountPage.successMessage()).not.toBeVisible()
    })

    test("changes the user's password", async ({
      page,
      navBar,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const accountPage = await navBar.clickAccount()
      await accountPage.fillCurrentPassword('supersecret')
      await accountPage.fillNewPassword('newpassword')
      await accountPage.fillNewPasswordConfirmation('newpassword')
      await accountPage.submit()

      await expect(accountPage.successMessage()).toBeVisible()

      await navBar.clickLogout()

      const loginPage = new LoginPage(page)
      await loginPage.fillEmail('cypress@example.com')
      await loginPage.fillPassword('newpassword')
      await loginPage.submit()

      await expect(page.getByTestId('flight-list')).toBeVisible()
    })
  })
})
