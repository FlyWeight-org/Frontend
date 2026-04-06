import type { Page } from '@playwright/test'

export class FlightShowPage {
  constructor(private readonly page: Page) {}

  authorizedFlight() {
    return this.page.getByTestId('authorized-flight')
  }

  async fillDate(): Promise<void> {
    await this.page.getByTestId('flight-date').click()
    await this.page.locator('.dp__calendar_item:not([aria-disabled])').first().click()
    await this.page.locator('.dp__action_select').click()
  }

  async fillDescription(description: string): Promise<void> {
    await this.page.getByTestId('flight-description').fill(description)
  }

  async clearAndFillDescription(description: string): Promise<void> {
    await this.page.getByTestId('flight-description').clear()
    await this.page.getByTestId('flight-description').fill(description)
  }

  async submitFlight(): Promise<void> {
    await this.page.getByTestId('flight-submit').click()
  }

  async deleteFlight(): Promise<void> {
    await this.page.getByTestId('delete-flight').click()
  }

  flightDescription() {
    return this.page.getByTestId('flight-description')
  }
}
