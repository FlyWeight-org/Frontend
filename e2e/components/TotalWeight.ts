import type { Page } from '@playwright/test'

export class TotalWeight {
  constructor(private readonly page: Page) {}

  total() {
    return this.page.getByTestId('total-weight')
  }

  breakdown() {
    return this.page.getByTestId('total-weight-breakdown')
  }
}
