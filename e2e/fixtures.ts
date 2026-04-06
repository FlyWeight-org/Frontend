import { test as base } from '@playwright/test'
import { LoginPage } from './pages/LoginPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SignUpPage } from './pages/SignUpPage'
import { AccountPage } from './pages/AccountPage'
import { FlightsListPage } from './pages/FlightsListPage'
import { FlightShowPage } from './pages/FlightShowPage'
import { PassengerFlightPage } from './pages/PassengerFlightPage'
import { NavBar } from './components/NavBar'
import { PassengerManifest } from './components/PassengerManifest'
import { CargoManifest } from './components/CargoManifest'
import { TotalWeight } from './components/TotalWeight'

const API_HOST = 'http://127.0.0.1:5000'

type Fixtures = {
  loginPage: LoginPage
  forgotPasswordPage: ForgotPasswordPage
  resetPasswordPage: ResetPasswordPage
  signUpPage: SignUpPage
  accountPage: AccountPage
  flightsListPage: FlightsListPage
  flightShowPage: FlightShowPage
  passengerFlightPage: PassengerFlightPage
  navBar: NavBar
  passengerManifest: PassengerManifest
  cargoManifest: CargoManifest
  totalWeight: TotalWeight
  resetDatabase: string
  loggedInPage: void
}

export const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  resetDatabase: async ({}, use) => {
    const response = await fetch(`${API_HOST}/__cypress__/reset`)
    const uuid = await response.text()
    await use(uuid)
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },

  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page))
  },

  resetPasswordPage: async ({ page }, use) => {
    await use(new ResetPasswordPage(page))
  },

  signUpPage: async ({ page }, use) => {
    await use(new SignUpPage(page))
  },

  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page))
  },

  flightsListPage: async ({ page }, use) => {
    await use(new FlightsListPage(page))
  },

  flightShowPage: async ({ page }, use) => {
    await use(new FlightShowPage(page))
  },

  passengerFlightPage: async ({ page }, use) => {
    await use(new PassengerFlightPage(page))
  },

  navBar: async ({ page }, use) => {
    await use(new NavBar(page))
  },

  passengerManifest: async ({ page }, use) => {
    await use(new PassengerManifest(page))
  },

  cargoManifest: async ({ page }, use) => {
    await use(new CargoManifest(page))
  },

  totalWeight: async ({ page }, use) => {
    await use(new TotalWeight(page))
  },

  loggedInPage: async ({ page, resetDatabase: _reset }, use) => {
    await page.goto('/')
    await page.getByTestId('login-email').fill('cypress@example.com')
    await page.getByTestId('login-password').fill('supersecret')
    await page.getByTestId('login-submit').click()
    await page.getByTestId('flight-list').waitFor()
    await use()
  },
})

export async function fetchLastEmail(): Promise<{
  html: string
} | null> {
  const response = await fetch(`${API_HOST}/__cypress__/last_email`)
  if (response.status !== 200) return null

  const { default: PostalMime } = await import('postal-mime')
  const text = await response.text()
  const parsed = await PostalMime.parse(text)
  return { html: parsed.html ?? '' }
}

export function extractEmailPath(html: string, baseURL: string): string {
  const match = /href="([^"]+)"/.exec(html)
  if (!match) throw new Error('No link found in email HTML')
  const url = new URL(match[1], baseURL)
  return url.pathname + url.search
}

export { expect } from '@playwright/test'
