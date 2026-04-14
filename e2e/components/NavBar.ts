import type { Page } from '@playwright/test'
import { AccountPage } from '../pages/AccountPage'
import { FlightsListPage } from '../pages/FlightsListPage'
import { FlightShowPage } from '../pages/FlightShowPage'
import { LoginPage } from '../pages/LoginPage'

export class NavBar {
  constructor(private readonly page: Page) {}

  async clickAccount(): Promise<AccountPage> {
    await this.page.getByRole('link', { name: /my account/i }).click()
    return new AccountPage(this.page)
  }

  async clickAddFlight(): Promise<FlightShowPage> {
    await this.page.getByTestId('nav-add-flight').click()
    return new FlightShowPage(this.page)
  }

  async clickMyFlights(): Promise<FlightsListPage> {
    await this.page.getByRole('link', { name: /my flights/i }).click()
    return new FlightsListPage(this.page)
  }

  async clickLogout(): Promise<LoginPage> {
    await this.page.getByRole('link', { name: /log out/i }).click()
    return new LoginPage(this.page)
  }

  logoutLink() {
    return this.page.getByTestId('nav-logout')
  }
}
