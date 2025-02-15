<template>
    <div class="container mt-5">
      <h1 class="mb-4">Управление Сортами</h1>
      <form @submit.prevent="addOrUpdateGrade" class="mb-4">
        <div class="mb-3">
          <input v-model="currentGrade.name" class="form-control" placeholder="Название сорта" required />
        </div>
        <div class="mb-3">
          <textarea v-model="currentGrade.description" class="form-control" placeholder="Описание сорта"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Обновить' : 'Добавить' }} Сорт</button>
      </form>
  
      <ul class="list-group">
        <li v-for="grade in grades" :key="grade.id" class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>{{ grade.name }}</strong>: {{ grade.description }}
          </div>
          <div>
            <button @click="editGrade(grade)" class="btn btn-sm btn-warning me-2">Редактировать</button>
            <button @click="deleteGrade(grade.id)" class="btn btn-sm btn-danger">Удалить</button>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useApi } from '../../utils/api'
  
  const { fetchWithAuth } = useApi()
  const grades = ref([])
  
  async function fetchGrades() {
    try {
      const response = await fetchWithAuth('/api/grades')
      grades.value = response
    } catch (error) {
      console.error('Ошибка при получении сортов:', error)
    }
  }
  
  fetchGrades() // Вызываем функцию для первоначальной загрузки данных
  
  const currentGrade = ref({ name: '', description: '' })
  const isEditing = ref(false)
  
  async function addOrUpdateGrade() {
    try {
      if (isEditing.value) {
        await fetchWithAuth(`/api/grades/${currentGrade.value.id}`, {
          method: 'PUT',
          body: JSON.stringify(currentGrade.value)
        })
      } else {
        await fetchWithAuth('/api/grades', {
          method: 'POST',
          body: JSON.stringify(currentGrade.value)
        })
      }
      fetchGrades() // Обновляем данные после изменения
      currentGrade.value = { name: '', description: '' }
      isEditing.value = false
    } catch (error) {
      console.error('Ошибка при добавлении/обновлении сорта:', error)
    }
  }
  
  function editGrade(grade) {
    currentGrade.value = { ...grade }
    isEditing.value = true
  }
  
  async function deleteGrade(id) {
    try {
      await fetchWithAuth(`/api/grades/${id}`, { method: 'DELETE' })
      fetchGrades() // Обновляем данные после удаления
    } catch (error) {
      console.error('Ошибка при удалении сорта:', error)
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  </style>