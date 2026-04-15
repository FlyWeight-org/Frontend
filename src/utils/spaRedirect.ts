// Reads (and clears) the path saved by public/404.html so the SPA can restore
// the user's intended URL after the static server redirected them to /.
const SPA_REDIRECT_KEY = 'spa-redirect'

export function consumeSpaRedirect(): string | null {
  try {
    const path = sessionStorage.getItem(SPA_REDIRECT_KEY)
    if (path) {
      sessionStorage.removeItem(SPA_REDIRECT_KEY)
      if (path !== '/') return path
    }
  } catch {
    // sessionStorage may be unavailable (private mode, etc.) — ignore.
  }
  return null
}
