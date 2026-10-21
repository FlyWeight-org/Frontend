import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/modules/auth'
import { JWT, expiredJWT } from '../util'

type FetchFn = (input: string, init: RequestInit) => Promise<Response>

const jsonResponse = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

/** Stores a session as a previous page load would have left it. */
function storeSession(storedJWT: string) {
  setActivePinia(createPinia())
  useAuthStore().$patch({ JWT: storedJWT, refreshToken: 'stored-refresh' })
  useAuthStore().saveToLocalStorage()
  setActivePinia(createPinia())
}

describe('restoreSession', () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout'] }))

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renews an expired access token and stores the rotated tokens', async () => {
    storeSession(expiredJWT)
    const fetchMock = vi
      .fn<FetchFn>()
      .mockResolvedValue(jsonResponse(200, { access_token: JWT, refresh_token: 'rotated-refresh' }))
    vi.stubGlobal('fetch', fetchMock)

    const auth = useAuthStore()
    await auth.restoreSession()

    expect(fetchMock.mock.calls[0][0]).toContain('/jwt-refresh')
    expect(auth.loggedIn).toBe(true)
    expect(localStorage.getItem('JWT')).toBe(JWT)
    expect(localStorage.getItem('refreshToken')).toBe('rotated-refresh')
  })

  it('keeps a valid session without contacting the server', async () => {
    storeSession(JWT)
    const fetchMock = vi.fn<FetchFn>()
    vi.stubGlobal('fetch', fetchMock)

    const auth = useAuthStore()
    await auth.restoreSession()

    expect(fetchMock).not.toHaveBeenCalled()
    expect(auth.loggedIn).toBe(true)
  })

  it('keeps the stored tokens when the network is unreachable', async () => {
    storeSession(expiredJWT)
    vi.stubGlobal('fetch', vi.fn<FetchFn>().mockRejectedValue(new TypeError('Failed to fetch')))

    const auth = useAuthStore()
    const restoring = auth.restoreSession()
    await vi.runAllTimersAsync()
    await restoring

    expect(auth.JWT).toBe(expiredJWT)
    expect(auth.refreshToken).toBe('stored-refresh')
  })
})
