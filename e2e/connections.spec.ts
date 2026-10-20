import { test, expect } from './fixtures'
import { ASSISTANT_NAME, connectAssistant, revokeAssistant } from './helpers/assistants'

test('connects an assistant through login and revokes its access', async ({
  page,
  request,
  loginPage,
  accountPage,
  assistantConsentPath,
}) => {
  await page.goto(assistantConsentPath)
  await loginPage.loginAs('cypress@example.com', 'supersecret')
  await expect(
    page.getByRole('heading', {
      name: `An app calling itself “${ASSISTANT_NAME}” wants to access your FlyWeight account`,
    }),
  ).toBeVisible()
  await expect(page.getByText('assistant.example', { exact: true })).toBeVisible()
  await expect(page.getByText(/Read flights and passenger\/cargo weights/)).toBeVisible()
  await connectAssistant(page, request)
  await expect(page).toHaveURL(/assistant\.example\/callback\?code=.+state=e2e-state/)
  await revokeAssistant(page, accountPage)
  await expect(page.getByRole('status')).toHaveText(`Access revoked for ${ASSISTANT_NAME}.`)
  await expect(page.getByText('No assistants are connected.')).toBeVisible()
})
