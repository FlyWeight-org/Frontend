type Theme = 'dark' | 'light'

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

// Apply on module load
applyTheme(getSystemTheme())

// Watch OS preference changes
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
mediaQuery.addEventListener('change', (e) => {
  applyTheme(e.matches ? 'dark' : 'light')
})

export default function useTheme() {
  // Side effects (applyTheme + mediaQuery listener) run on module import above
}
