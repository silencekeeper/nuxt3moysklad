<template>
  <div class="users-index">
    <h2>Список пользователей</h2>
    <table>
      <thead>
        <tr>
          <th>Логин</th>
          <th>Роль</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.username }}</td>
          <td>{{ user.role }}</td>
          <td>
            <nuxt-link :to="`/users/${user.id}`">Редактировать</nuxt-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const { data: users } = await useFetch('/api/users')
</script>