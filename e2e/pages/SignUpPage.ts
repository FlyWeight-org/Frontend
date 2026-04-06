import type { Page } from '@playwright/test'

export class SignUpPage {
  constructor(private readonly page: Page) {}

  async visit(): Promise<this> {
    await this.page.goto('/')
    await this.page.getByRole('tab', { name: /sign up/i }).click()
    return this
  }

  async fillName(name: string): Promise<void> {
    await this.page.getByTestId('signup-name').fill(name)
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.getByTestId('signup-email').fill(email)
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.getByTestId('signup-password').fill(password)
  }

  async fillPasswordConfirmation(confirmation: string): Promise<void> {
    await this.page.getByTestId('signup-password-confirmation').fill(confirmation)
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('signup-submit').click()
  }
}
