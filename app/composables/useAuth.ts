export function useAuth() {
  const { loggedIn, user, fetch: refreshSession, clear } = useUserSession()

  async function login(email: string, password: string) {
    await $fetch('/api/auth/login', { method: 'POST', body: { email, password } })
    await refreshSession()
  }

  async function register(name: string, email: string, password: string) {
    await $fetch('/api/auth/register', { method: 'POST', body: { name, email, password } })
    await refreshSession()
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clear()
    await navigateTo('/')
  }

  return { loggedIn, user, login, register, logout, refreshSession }
}
