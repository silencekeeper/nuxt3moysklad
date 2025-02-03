import { useCookie, useRuntimeConfig } from '#app'

export const useApi = () => {
  const config = useRuntimeConfig()
  const msToken = useCookie('ms_token')

  const fetchWithAuth = (url: string, options: any = {}) => {
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${msToken.value}`,
      'Content-Type': 'application/json'
    }

    return $fetch(url, {
      ...options,
      headers,
      baseURL: config.public.apiBaseUrl,
      credentials: 'include',
      async onResponse({ request, response, options }) {
        if (response.status === 401) {
          await navigateTo('/login')
        }
      },
    })
  }

  return {
    fetchWithAuth
  }
} 