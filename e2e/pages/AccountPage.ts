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
}
