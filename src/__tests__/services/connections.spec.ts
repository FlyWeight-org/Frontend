import { describe, expect, it, vi } from 'vitest'
import { decideConsent, loadConsent } from '@/services/connections'
import { request } from '@/stores/modules/root'

vi.mock('@/stores/modules/root', () => ({ request: vi.fn() }))

const callback = 'https://assistant.example/callback?client=desktop'
const query = new URLSearchParams({ redirect_uri: callback })

function respondWith(body: unknown): void {
  vi.mocked(request).mockResolvedValue(new Response(JSON.stringify(body)))
}

describe('assistant callback navigation', () => {
  it('rejects executable callbacks before showing consent or navigating', async () => {
    // oxlint-disable-next-line no-script-url -- Exercises rejection of an executable callback.
    const unsafe = 'javascript://example.com/%0aalert(document.domain)//'
    respondWith({
      client_name: 'Assistant',
      client_id: 'client',
      redirect_uri: unsafe,
      scopes: ['flights:read'],
      pilot: { name: 'Pilot', email: 'pilot@example.com' },
    })
    await expect(loadConsent(query)).rejects.toThrow()
    for (const decision of ['allow', 'deny'] as const) {
      respondWith({ redirect_uri: unsafe })
      await expect(decideConsent(query, decision)).rejects.toThrow()
    }
  })

  it('requires the callback destination and registered query to remain unchanged', async () => {
    for (const url of [
      'https://attacker.example/callback?client=desktop&code=code',
      'https://assistant.example/other?client=desktop&code=code',
      'https://assistant.example/callback?client=other&code=code',
    ]) {
      respondWith({ redirect_uri: url })
      await expect(decideConsent(query, 'allow')).rejects.toThrow()
    }
    for (const registered of [callback, `${callback}&tag=a&tag=b`]) {
      const approved = `${registered}&code=code&state=state`
      respondWith({ redirect_uri: approved })
      await expect(
        decideConsent(new URLSearchParams({ redirect_uri: registered }), 'allow'),
      ).resolves.toBe(approved)
    }
  })
})
