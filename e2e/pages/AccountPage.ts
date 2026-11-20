import type { Page } from '@playwright/test'

export class AccountPage {
  constructor(private readonly page: Page) {}

  async clearAndFillName(name: string): Promise<void> {
    await this.page.getByTestId('account-name').clear()
    await this.page.getByTestId('account-name').fill(name)
  }

  async clearAndFillEmail(email: string): Promise<void> {
    await this.page.getByTestId('account-email').clear()
    await this.page.getByTestId('account-email').fill(email)
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('account-submit').click()
  }

  successMessage() {
    return this.page.getByTestId('account-success')
  }

  revokeAssistantButton(name: string) {
    return this.page.getByRole('button', { name: `Revoke access for ${name}`, exact: true })
  }

  async addPasskey(label: string, password: string): Promise<void> {
    await this.page.getByTestId('passkey-new-label').fill(label)
    await this.page.getByTestId('passkey-new-password').fill(password)
    await this.page.getByTestId('passkey-add').click()
  }

  passkeysSuccessMessage() {
    return this.page.getByTestId('passkeys-success')
  }

  passkeyLabel() {
    return this.page.getByTestId('passkey-label')
  }
}
