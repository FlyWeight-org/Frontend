import type { Page } from '@playwright/test'

export class ForgotPasswordPage {
  constructor(private readonly page: Page) {}

  async fillEmail(email: string): Promise<void> {
    await this.page.getByTestId('forgot-password-email').fill(email)
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('forgot-password-submit').click()
  }

  successMessage() {
    return this.page.getByTestId('forgot-password-success')
  }
}
