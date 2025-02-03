export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/auth`, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ошибка авторизации'
    })
  }
})