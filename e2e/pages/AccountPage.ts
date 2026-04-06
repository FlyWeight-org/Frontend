import type { Page } from '@playwright/test'

export class AccountPage {
  constructor(private readonly page: Page) {}

  async clearAndFillName(name: string): Promise<void> {
    await this.page.getByTestId('account-name').clear()
    await this.page.getByTestId('account-name').fill(name)
  }

  async fillCurrentPassword(password: string): Promise<void> {
    await this.page.getByTestId('account-password').fill(password)
  }

  async fillNewPassword(password: string): Promise<void> {
    await this.page.getByTestId('account-new-password').fill(password)
  }

  async fillNewPasswordConfirmation(confirmation: string): Promise<void> {
    await this.page.getByTestId('account-new-password-confirmation').fill(confirmation)
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('account-submit').click()
  }

  successMessage() {
    return this.page.getByTestId('account-success')
  }
}
