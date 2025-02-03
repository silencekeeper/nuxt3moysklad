<template>
  <div class="user-edit">
    <h2>Редактирование пользователя</h2>
    <form @submit.prevent="updateUser">
      <div>
        <label for="username">Логин:</label>
        <input type="text" id="username" v-model="user.username" required>
      </div>
      <div>
        <label for="role">Роль:</label>
        <select id="role" v-model="user.role" required>
          <option value="admin">Админ</option>
          <option value="user">Пользователь</option>
        </select>
      </div>
      <button type="submit">Сохранить</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const user = ref({})

onMounted(async () => {
  const { data } = await useFetch(`/api/users/${route.params.id}`)
  user.value = data.value
})

async function updateUser() {
  await $fetch(`/api/users/${route.params.id}`, {
    method: 'PUT',
    body: user.value
  })
  // Перенаправление на страницу со списком пользователей после обновления
  navigateTo('/users')
}
</script>