<template>
  <div class="transfers-create">
    <h2>Создание перемещения</h2>
    <form @submit.prevent="createTransfer">
      <div>
        <label for="name">Название:</label>
        <input type="text" id="name" v-model="transfer.name" required>
      </div>
      <div>
        <label for="date">Дата:</label>
        <input type="date" id="date" v-model="transfer.date" required>
      </div>
      <div>
        <label for="status">Статус:</label>
        <select id="status" v-model="transfer.status" required>
          <option value="active">Активно</option>
          <option value="completed">Завершено</option>
        </select>
      </div>
      <button type="submit">Создать</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const transfer = reactive({
  name: '',
  date: '',
  status: 'active'
})

async function createTransfer() {
  await $fetch('/api/transfers', {
    method: 'POST',
    body: transfer
  })
  // Перенаправление на страницу со списком после создания
  navigateTo('/transfers')
}
</script>
