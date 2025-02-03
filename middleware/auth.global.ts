export default defineNuxtRouteMiddleware((to) => {
  const msToken = useCookie('ms_token')
  const publicRoutes = ['/login']

  if (!msToken.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
})