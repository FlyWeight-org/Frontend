import { test, expect } from './fixtures'
import { FlightsListPage } from './pages/FlightsListPage'

test.describe('as a pilot', () => {
  test.describe('viewing flights', () => {
    test('displays a list of flights', async ({
      flightsListPage,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      await expect(flightsListPage.flightList()).toBeVisible()
    })
  })

  test.describe('creating a flight', () => {
    test.skip('displays errors', async ({
      page,
      navBar,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const flightPage = await navBar.clickAddFlight()
      await page.getByTestId('flight-date').click()
      await flightPage.fillDescription('example flight description')
      await flightPage.submitFlight()

      await expect(page.locator('[data-testid="field-errors"][data-name="date"]')).toContainText(
        'invalid',
      )
    })

    test('creates a flight', async ({ navBar, loggedInPage: _login, resetDatabase: _reset }) => {
      const flightPage = await navBar.clickAddFlight()
      await flightPage.fillDate()
      await flightPage.fillDescription('example flight description')
      await flightPage.submitFlight()

      await expect(flightPage.authorizedFlight()).toBeVisible()
    })
  })

  test.describe('editing a flight', () => {
    test.skip('displays errors', async ({
      page,
      flightsListPage,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const flightPage = await flightsListPage.clickFirstFlight()
      await page.getByTestId('flight-date').click()
      await flightPage.submitFlight()

      await expect(page.locator('[data-testid="field-errors"][data-name="date"]')).toContainText(
        'invalid',
      )
    })

    test('edits a flight', async ({
      page,
      flightsListPage,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const flightPage = await flightsListPage.clickFirstFlight()
      await flightPage.clearAndFillDescription('new description')
      await flightPage.submitFlight()
      await page.reload()

      await expect(flightPage.flightDescription()).toHaveValue('new description')
    })
  })

  test.describe('loads', () => {
    test.describe('passengers', () => {
      test('displays errors', async ({
        flightsListPage,
        passengerManifest,
        loggedInPage: _login,
        resetDatabase: _reset,
      }) => {
        await flightsListPage.clickFirstFlight()
        await passengerManifest.clickAdd()
        await passengerManifest.fillForm('New Pax', '0')

        await expect(passengerManifest.errorsFor('weight')).toContainText('greater than 0')
      })

      test('adds a load', async ({
        flightsListPage,
        passengerManifest,
        totalWeight,
        page,
        loggedInPage: _login,
        resetDatabase: _reset,
      }) => {
        await flightsListPage.clickFirstFlight()
        await passengerManifest.clickAdd()
        await passengerManifest.fillForm('New Pax', '180', '25')

        await expect(passengerManifest.passengerListItems()).toHaveCount(2)

        const lastItem = passengerManifest.passengerListItems().last()
        await expect(lastItem.getByTestId('passenger-name')).toContainText('New Pax')
        await expect(lastItem.getByTestId('passenger-weight')).toContainText('180')
        await expect(lastItem.getByTestId('passenger-bags-weight')).toContainText('25')

        await expect(totalWeight.total()).toContainText('390 lb')
        await expect(totalWeight.breakdown()).toContainText(
          '(165 lb avg. passenger, 60 lb total cargo)',
        )
      })

      test('updates an existing load', async ({
        page,
        flightsListPage,
        passengerManifest,
        totalWeight,
        loggedInPage: _login,
        resetDatabase: _reset,
      }) => {
        await flightsListPage.clickFirstFlight()
        await passengerManifest.clickAdd()
        await passengerManifest.fillForm('Example Passenger', '180', '25')

        await expect(passengerManifest.passengerListItems()).toHaveCount(1)

        const item = page.getByTestId('passenger-list-item')
        await expect(item.getByTestId('passenger-name')).toContainText('Example Passenger')
        await expect(item.getByTestId('passenger-weight')).toContainText('180')
        await expect(item.getByTestId('passenger-bags-weight')).toContainText('25')

        await expect(totalWeight.total()).toContainText('230 lb')
        await expect(totalWeight.breakdown()).toContainText(
          '(180 lb avg. passenger, 50 lb total cargo)',
        )
      })

      test('disables a load', async ({
        flightsListPage,
        passengerManifest,
        totalWeight,
        loggedInPage: _login,
        resetDatabase: _reset,
      }) => {
        await flightsListPage.clickFirstFlight()
        await passengerManifest.toggleEnabled()

        await expect(totalWeight.total()).toContainText('25 lb')
        await expect(totalWeight.breakdown()).not.toBeVisible()
      })

      test('removes a load', async ({
        flightsListPage,
        passengerManifest,
        totalWeight,
        loggedInPage: _login,
        resetDatabase: _reset,
      }) => {
        await flightsListPage.clickFirstFlight()
        await passengerManifest.deletePassenger()

        await expect(passengerManifest.noPassengersMessage()).toBeVisible()
        await expect(totalWeight.total()).toContainText('25 lb')
        await expect(totalWeight.breakdown()).not.toBeVisible()
      })
    })

    test.describe('cargo', () => {
      test('displays errors', async ({
        flightsListPage,
        cargoManifest,
        loggedInPage: _login,
        resetDatabase: _reset,
      }) => {
        await flightsListPage.clickFirstFlight()
        await cargoManifest.clickAdd()
        await cargoManifest.fillForm('New Cargo', '0')

        await expect(cargoManifest.errorsFor('bags_weight')).toContainText('greater than 0')
      })

      test('adds a load', async ({
        page,
        flightsListPage,
        cargoManifest,
        totalWeight,
        loggedInPage: _login,
        resetDatabase: _reset,
      }) => {
        await flightsListPage.clickFirstFlight()
        await cargoManifest.clickAdd()
        await cargoManifest.fillForm('New Cargo', '50')

        await expect(cargoManifest.cargoListItems()).toHaveCount(2)

        const lastItem = cargoManifest.cargoListItems().last()
        await expect(lastItem.getByTestId('cargo-name')).toContainText('New Cargo')
        await expect(lastItem.getByTestId('cargo-weight')).toContainText('50')

        await expect(totalWeight.total()).toContainText('235 lb')
        await expect(totalWeight.breakdown()).toContainText(
          '(150 lb avg. passenger, 85 lb total cargo)',
        )
      })

      test('updates an existing load', async ({
        page,
        flightsListPage,
        cargoManifest,
        totalWeight,
        loggedInPage: _login,
        resetDatabase: _reset,
      }) => {
        await flightsListPage.clickFirstFlight()
        await cargoManifest.clickAdd()
        await cargoManifest.fillForm('Example Cargo', '50')

        await expect(cargoManifest.cargoListItems()).toHaveCount(1)

        const item = page.getByTestId('cargo-list-item')
        await expect(item.getByTestId('cargo-name')).toContainText('Example Cargo')
        await expect(item.getByTestId('cargo-weight')).toContainText('50')

        await expect(totalWeight.total()).toContainText('210 lb')
        await expect(totalWeight.breakdown()).toContainText(
          '(150 lb avg. passenger, 60 lb total cargo)',
        )
      })

      test('disables a load', async ({
        flightsListPage,
        cargoManifest,
        totalWeight,
        loggedInPage: _login,
        resetDatabase: _reset,
      }) => {
        await flightsListPage.clickFirstFlight()
        await cargoManifest.toggleEnabled()

        await expect(totalWeight.total()).toContainText('160 lb')
        await expect(totalWeight.breakdown()).toContainText(
          '(150 lb avg. passenger, 10 lb total cargo)',
        )
      })

      test('removes a load', async ({
        flightsListPage,
        cargoManifest,
        totalWeight,
        loggedInPage: _login,
        resetDatabase: _reset,
      }) => {
        await flightsListPage.clickFirstFlight()
        await cargoManifest.deleteCargo()

        await expect(cargoManifest.noCargoMessage()).toBeVisible()
        await expect(totalWeight.total()).toContainText('160 lb')
        await expect(totalWeight.breakdown()).toContainText(
          '(150 lb avg. passenger, 10 lb total cargo)',
        )
      })
    })
  })

  test.describe('deleting a flight', () => {
    test('deletes a flight', async ({
      page,
      flightsListPage,
      loggedInPage: _login,
      resetDatabase: _reset,
    }) => {
      const flightPage = await flightsListPage.clickFirstFlight()
      await flightPage.deleteFlight()

      const newFlightsPage = new FlightsListPage(page)
      await expect(newFlightsPage.noFlightsMessage()).toBeVisible()
    })
  })
})
