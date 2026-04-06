import type { Page } from '@playwright/test'
import { FlightShowPage } from './FlightShowPage'

export class FlightsListPage {
  constructor(private readonly page: Page) {}

  flightList() {
    return this.page.getByTestId('flight-list')
  }

  noFlightsMessage() {
    return this.page.getByTestId('no-flights')
  }

  async clickFirstFlight(): Promise<FlightShowPage> {
    await this.page.getByTestId('flight-list-item').first().click()
    return new FlightShowPage(this.page)
  }
}
