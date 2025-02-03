export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/auth/status`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка при проверке статуса авторизации'
    })
  }
}) 