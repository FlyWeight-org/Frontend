import { test, expect } from './fixtures'
import { FlightsListPage } from './pages/FlightsListPage'

test.describe('as a passenger', () => {
  test('displays the unauthorized flight page', async ({
    passengerFlightPage,
    resetDatabase: flightUUID,
  }) => {
    await passengerFlightPage.visit(flightUUID)

    await expect(passengerFlightPage.unauthTitle()).toContainText(
      'Are you going on a flight with Cypress User on',
    )
  })

  test('handles form errors', async ({ page, passengerFlightPage, resetDatabase: flightUUID }) => {
    await passengerFlightPage.visit(flightUUID)
    await passengerFlightPage.fillName(' ')
    await passengerFlightPage.fillWeight('123')
    await passengerFlightPage.submit()

    await expect(page.locator('[data-testid="field-errors"][data-name="name"]')).toContainText(
      'can\u2019t be blank',
    )
  })

  test('adds a passenger', async ({ page, passengerFlightPage, resetDatabase: flightUUID }) => {
    await passengerFlightPage.visit(flightUUID)
    await passengerFlightPage.fillName('New Pax')
    await passengerFlightPage.fillWeight('123')
    await passengerFlightPage.fillBagsWeight('23')
    await passengerFlightPage.submit()

    await expect(passengerFlightPage.finishedMessage()).toBeVisible()

    // Log in mid-test to verify the passenger
    await page.goto('/')
    await page.getByTestId('login-email').fill('cypress@example.com')
    await page.getByTestId('login-password').fill('supersecret')
    await page.getByTestId('login-submit').click()
    await page.getByTestId('flight-list').waitFor()

    const flightsPage = new FlightsListPage(page)
    await flightsPage.clickFirstFlight()

    const passengerItems = page.getByTestId('passenger-list-item')
    await expect(passengerItems).toHaveCount(2)

    const lastItem = passengerItems.last()
    await expect(lastItem.getByTestId('passenger-name')).toContainText('New Pax')
    await expect(lastItem.getByTestId('passenger-weight')).toContainText('123')
    await expect(lastItem.getByTestId('passenger-bags-weight')).toContainText('23')

    await expect(page.getByTestId('total-weight')).toContainText('331 lb')
    await expect(page.getByTestId('total-weight-breakdown')).toContainText(
      '(137 lb avg. passenger, 58 lb total cargo)',
    )
  })

  test('updates a passenger', async ({ page, passengerFlightPage, resetDatabase: flightUUID }) => {
    await passengerFlightPage.visit(flightUUID)
    await passengerFlightPage.fillName('Example Passenger')
    await passengerFlightPage.fillWeight('123')
    await passengerFlightPage.fillBagsWeight('23')
    await passengerFlightPage.submit()

    await expect(passengerFlightPage.finishedMessage()).toBeVisible()

    // Log in mid-test to verify the passenger
    await page.goto('/')
    await page.getByTestId('login-email').fill('cypress@example.com')
    await page.getByTestId('login-password').fill('supersecret')
    await page.getByTestId('login-submit').click()
    await page.getByTestId('flight-list').waitFor()

    const flightsPage = new FlightsListPage(page)
    await flightsPage.clickFirstFlight()

    const passengerItems = page.getByTestId('passenger-list-item')
    await expect(passengerItems).toHaveCount(1)

    const lastItem = passengerItems.last()
    await expect(lastItem.getByTestId('passenger-name')).toContainText('Example Passenger')
    await expect(lastItem.getByTestId('passenger-weight')).toContainText('123')
    await expect(lastItem.getByTestId('passenger-bags-weight')).toContainText('23')

    await expect(page.getByTestId('total-weight')).toContainText('171 lb')
    await expect(page.getByTestId('total-weight-breakdown')).toContainText(
      '(123 lb avg. passenger, 48 lb total cargo)',
    )
  })
})
