import { test, expect } from './fixtures'

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
      await accountPage.submit()

      await expect(page.locator('[data-testid="field-errors"][data-name="name"]')).toContainText(
        'can\u2019t be blank',
      )
      await expect(accountPage.successMessage()).not.toBeVisible()
    })

    test("updates the user's account", async ({
      navBar,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const accountPage = await navBar.clickAccount()
      await accountPage.clearAndFillName('New Name')
      await accountPage.submit()

      await expect(accountPage.successMessage()).toBeVisible()
    })
  })
})
