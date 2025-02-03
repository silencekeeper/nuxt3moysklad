<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center">Авторизация МойСклад</h2>
            <form @submit.prevent="saveToken">
              <div class="mb-3">
                <label for="token" class="form-label">Токен:</label>
                <input 
                  v-model="token"
                  type="text" 
                  id="token" 
                  class="form-control"
                  placeholder="Введите токен МойСклад"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">Войти</button>
              <p v-if="error" class="text-danger mt-2">{{ error }}</p>
              <p v-if="authStatus" class="text-success mt-2">{{ authStatus }}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/utils/api'

const token = ref('02bf2b522f9bb7671245b1c825e9d669a7cd581a') // Значение по умолчанию
const error = ref(null)
const authStatus = ref('')
const router = useRouter()
const { fetchWithAuth } = useApi()

async function saveToken() {
  try {
    const response = await fetchWithAuth('/api/token', {
      method: 'POST',
      body: {
        access_token: token.value
      }
    })

    if (response.success) {
      useCookie('ms_token').value = token.value
      router.push('/supplies')
    } else {
      error.value = 'Ошибка при сохранении токена'
    }
  } catch (err) {
    error.value = 'Ошибка при сохранении токена'
    console.error('Error saving token:', err)
  }
}

onMounted(async () => {
  try {
    const response = await fetchWithAuth('/api/auth/status')
    if (response.authenticated) {
      authStatus.value = `Вы авторизованы как ${response.user}`
    }
  } catch (err) {
    console.error('Error checking auth status:', err)
  }
})
</script>

