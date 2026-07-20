export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  if (!loggedIn.value) {
    return navigateTo(`/connexion?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
