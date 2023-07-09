import { onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/modules/auth'
import { useRouter } from 'vue-router'

export default function requireAuth() {
  onMounted(async () => {
    const authStore = useAuthStore()
    const router = useRouter()

    if (!authStore.loggedIn) await router.push({ name: 'logIn' })

    watch(
      () => authStore.loggedIn,
      async (isLoggedIn) => {
        if (!isLoggedIn) await router.push({ name: 'logIn' })
      }
    )
  })
}
