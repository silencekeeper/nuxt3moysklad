export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchWithAuth } = useApi()

  try {
    const { data } = await fetchWithAuth('/api/auth/status')
    
    if (!data.authenticated) {
      return navigateTo('/login')
    }
  } catch (error) {
    console.error('Ошибка при проверке статуса авторизации:', error)
    return navigateTo('/login')
  }
}) 