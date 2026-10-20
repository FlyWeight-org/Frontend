import { z } from 'zod'
import { request } from '@/stores/modules/root'

const callbackSchema = z.url().refine((value) => {
  const url = new URL(value)
  return (
    !url.username &&
    !url.password &&
    !url.hash &&
    (url.protocol === 'https:' ||
      (url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))
  )
})

const scopes = z.array(z.enum(['flights:read', 'flights:write']))
const consentSchema = z.object({
  client_name: z.string(),
  client_id: z.string(),
  redirect_uri: callbackSchema,
  scopes,
  pilot: z.object({ name: z.string(), email: z.string() }),
})
const connectionSchema = z.object({
  id: z.number(),
  name: z.string(),
  scopes,
  created_at: z.string(),
  callback_host: z.string(),
})

/** Validated details of a pending assistant authorization. */
export type Consent = z.infer<typeof consentSchema>
/** A pilot's revocable connection to an assistant. */
export type Connection = z.infer<typeof connectionSchema>

/** Loads server-validated client details and requested permissions. */
export async function loadConsent(query: URLSearchParams): Promise<Consent> {
  const response = await request({ path: `/oauth/authorize?${query}` })
  if (!response.ok) throw new Error('Authorization request unavailable')
  return consentSchema.parse(await response.json())
}

/** Approves or denies a validated request and returns the server's OAuth callback. */
export async function decideConsent(
  query: URLSearchParams,
  decision: 'allow' | 'deny',
): Promise<string> {
  const response = await request({
    path: '/oauth/authorize',
    method: 'post',
    body: { ...Object.fromEntries(query), decision },
  })
  if (!response.ok) throw new Error('Authorization decision failed')
  const callback = z
    .object({ redirect_uri: callbackSchema })
    .parse(await response.json()).redirect_uri
  const expected = new URL(callbackSchema.parse(query.get('redirect_uri')))
  if (!preservesRegisteredCallback(expected, new URL(callback))) {
    throw new Error('Authorization callback does not match the request')
  }
  return callback
}

function preservesRegisteredCallback(expected: URL, actual: URL): boolean {
  return sameEndpoint(expected, actual) && startsWithRegisteredQuery(expected, actual)
}

function sameEndpoint(expected: URL, actual: URL): boolean {
  return actual.origin === expected.origin && actual.pathname === expected.pathname
}

function startsWithRegisteredQuery(expected: URL, actual: URL): boolean {
  const returned = [...actual.searchParams]
  return [...expected.searchParams].every(
    ([key, value], index) => returned[index]?.[0] === key && returned[index]?.[1] === value,
  )
}

/** Lists the current pilot's assistant connections and feature availability. */
export async function loadConnections(): Promise<{ enabled: boolean; connections: Connection[] }> {
  const response = await request({ path: '/account/connections' })
  if (!response.ok) throw new Error('Connections unavailable')
  return z
    .object({ enabled: z.boolean(), connections: z.array(connectionSchema) })
    .parse(await response.json())
}

/** Immediately revokes every grant for one of the pilot's connected clients. */
export async function revokeConnection(id: number): Promise<void> {
  const response = await request({ path: `/account/connections/${String(id)}`, method: 'delete' })
  if (!response.ok) throw new Error('Revocation failed')
}
