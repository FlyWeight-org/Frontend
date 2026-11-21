import type { BrowserContext, Route } from '@playwright/test'

const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js*'
const ANALYTICS_BEACON = 'https://static.cloudflareinsights.com/beacon.min.js*'

/**
 * Stands in for Cloudflare's Turnstile script. Each widget at once yields the
 * dummy token Cloudflare's test site keys issue, in the hidden
 * `cf-turnstile-response` input the real widget renders, and yields it again
 * after a reset. Runs in the page, so it must be self-contained.
 */
function fakeTurnstile(): void {
  const TOKEN = 'XXXX.DUMMY.TOKEN.XXXX'
  type Widget = { input: HTMLInputElement; callback?: (token: string) => void }
  const widgets = new Map<string, Widget>()
  let lastID = 0

  const solve = ({ input, callback }: Widget): void => {
    input.value = TOKEN
    callback?.(TOKEN)
  }

  const reissue = (widget: Widget): void => {
    widget.input.value = ''
    setTimeout(() => solve(widget))
  }

  Object.assign(window, {
    turnstile: {
      render(container: HTMLElement, { callback }: Pick<Widget, 'callback'>): string {
        const id = String(++lastID)
        const input = Object.assign(document.createElement('input'), {
          type: 'hidden',
          name: 'cf-turnstile-response',
        })
        const widget = { input, callback }
        container.append(input)
        widgets.set(id, widget)
        reissue(widget)
        return id
      },
      reset(id?: string): void {
        const targets = id ? [widgets.get(id)] : [...widgets.values()]
        targets.forEach((widget) => widget && reissue(widget))
      },
      remove(id: string): void {
        widgets.get(id)?.input.remove()
        widgets.delete(id)
      },
    },
  })

  const script = document.currentScript as HTMLScriptElement | null
  const onload = script && new URL(script.src).searchParams.get('onload')
  if (onload) (window as unknown as Record<string, (() => void) | undefined>)[onload]?.()
}

function serveScript(body: string): (route: Route) => Promise<void> {
  return (route) => route.fulfill({ contentType: 'text/javascript', body })
}

/**
 * Serves local stand-ins for the Cloudflare scripts every page loads, so no
 * test waits on Cloudflare: {@link fakeTurnstile} for Turnstile, and an empty
 * script for the Web Analytics beacon, which otherwise holds up the page's
 * `load` event.
 */
export async function stubCloudflare(context: BrowserContext): Promise<void> {
  await context.route(TURNSTILE_SCRIPT, serveScript(`(${fakeTurnstile.toString()})()`))
  await context.route(ANALYTICS_BEACON, serveScript(''))
}
