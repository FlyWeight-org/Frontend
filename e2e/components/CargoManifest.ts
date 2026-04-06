import type { Page } from '@playwright/test'

export class CargoManifest {
  constructor(private readonly page: Page) {}

  private root() {
    return this.page.getByTestId('cargo-manifest')
  }

  async clickAdd(): Promise<void> {
    await this.root().getByTestId('add-load').click()
  }

  async fillForm(name: string, weight: string): Promise<void> {
    const form = this.root().getByTestId('cargo-form')
    await form.getByTestId('cargo-name').fill(name)
    await form.getByTestId('cargo-weight').fill(weight)
    await form.getByTestId('cargo-submit').click()
  }

  cargoListItems() {
    return this.root().getByTestId('cargo-list-item')
  }

  errorsFor(field: string) {
    return this.root().locator(`[data-testid="field-errors"][data-name="${field}"]`)
  }

  noCargoMessage() {
    return this.page.getByTestId('no-cargo')
  }

  async toggleEnabled(): Promise<void> {
    await this.page.getByTestId('cargo-enabled').uncheck()
  }

  async deleteCargo(): Promise<void> {
    await this.page.getByTestId('cargo-list-item').hover()
    await this.page.getByTestId('cargo-delete').click()
  }
}
