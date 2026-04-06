import type { Page } from '@playwright/test'

export class PassengerManifest {
  constructor(private readonly page: Page) {}

  private root() {
    return this.page.getByTestId('passenger-manifest')
  }

  async clickAdd(): Promise<void> {
    await this.root().getByTestId('add-load').click()
  }

  async fillForm(name: string, weight: string, bagsWeight?: string): Promise<void> {
    const form = this.root().getByTestId('passenger-form')
    await form.getByTestId('passenger-name').fill(name)
    await form.getByTestId('passenger-weight').fill(weight)
    if (bagsWeight) {
      await form.getByTestId('passenger-bags-weight').fill(bagsWeight)
    }
    await form.getByTestId('passenger-submit').click()
  }

  passengerListItems() {
    return this.root().getByTestId('passenger-list-item')
  }

  errorsFor(field: string) {
    return this.root().locator(`[data-testid="field-errors"][data-name="${field}"]`)
  }

  noPassengersMessage() {
    return this.page.getByTestId('no-passengers')
  }

  async toggleEnabled(): Promise<void> {
    await this.page.getByTestId('passenger-enabled').uncheck()
  }

  async deletePassenger(): Promise<void> {
    await this.page.getByTestId('passenger-list-item').hover()
    await this.page.getByTestId('passenger-delete').click()
  }
}
