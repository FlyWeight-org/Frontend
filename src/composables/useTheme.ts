import { watch } from 'vue'
import { usePreferredDark } from '@vueuse/core'

type Theme = 'dark' | 'light'

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export default function useTheme() {
  const isDark = usePreferredDark()
  applyTheme(isDark.value ? 'dark' : 'light')
  watch(isDark, (dark) => {
    applyTheme(dark ? 'dark' : 'light')
  })
}
