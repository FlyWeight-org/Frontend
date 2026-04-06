import type { Page } from '@playwright/test'
import { FlightsListPage } from './FlightsListPage'
import { ForgotPasswordPage } from './ForgotPasswordPage'

export class LoginPage {
  constructor(private readonly page: Page) {}

  async visit(): Promise<this> {
    await this.page.goto('/')
    return this
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.getByTestId('login-email').fill(email)
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.getByTestId('login-password').fill(password)
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('login-submit').click()
  }

  loginError() {
    return this.page.getByTestId('login-error')
  }

  async clickForgotPassword(): Promise<ForgotPasswordPage> {
    await this.page.getByTestId('forgot-password-link').click()
    return new ForgotPasswordPage(this.page)
  }

  async loginAs(email: string, password: string): Promise<FlightsListPage> {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.submit()
    return new FlightsListPage(this.page)
  }
}
