import type { Page } from '@playwright/test'

export class PassengerFlightPage {
  constructor(private readonly page: Page) {}

  async visit(flightUUID: string): Promise<this> {
    await this.page.goto(`/flights/${flightUUID}`)
    return this
  }

  unauthTitle() {
    return this.page.getByTestId('flight-unauth-title')
  }

  async fillName(name: string): Promise<void> {
    await this.page.getByTestId('passenger-name').fill(name)
  }

  async fillWeight(weight: string): Promise<void> {
    await this.page.getByTestId('passenger-weight').waitFor({ state: 'visible' })
    await this.page.getByTestId('passenger-weight').fill(weight)
  }

  async fillBagsWeight(weight: string): Promise<void> {
    await this.page.getByTestId('passenger-bags-weight').waitFor({ state: 'visible' })
    await this.page.getByTestId('passenger-bags-weight').fill(weight)
  }

  async submit(): Promise<void> {
    await this.page.getByTestId('passenger-submit').waitFor({ state: 'visible' })
    await this.page.getByTestId('passenger-submit').click()
  }

  finishedMessage() {
    return this.page.getByTestId('flight-finished')
  }
}
