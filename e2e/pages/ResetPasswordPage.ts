import type { Page } from '@playwright/test'

export class ResetPasswordPage {
  constructor(private readonly page: Page) {}

  async visit(path: string): Promise<this> {
    await this.page.goto(path)
    return this
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.getByTestId('reset-password-password').fill(password)
  }

  async fillPasswordConfirmation(confirmation: string): Promise<void> {
    await this.page.getByTestId('reset-password-password-confirmation').fill(confirmation)
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('reset-password-submit').click()
  }

  successMessage() {
    return this.page.getByTestId('reset-password-success')
  }
}
