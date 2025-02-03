<template>
  <div class="container mt-5">
    <h1 class="mb-4">Управление Формулами</h1>
    <form @submit.prevent="addOrUpdateFormula" class="mb-4">
      <div class="mb-3">
        <input v-model="currentFormula.name" class="form-control" placeholder="Название формулы" required />
      </div>
      <div class="mb-3">
        <input v-model="currentFormula.formula" class="form-control" placeholder="Формула" required />
      </div>
      <div class="mb-3">
        <textarea v-model="currentFormula.variables" class="form-control" placeholder="Переменные (JSON)" required></textarea>
      </div>
      <button type="submit" class="btn btn-primary">{{ isEditing ? 'Обновить' : 'Добавить' }} Формулу</button>
    </form>

    <ul class="list-group">
      <li v-for="formula in formulas" :key="formula.id" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>{{ formula.name }}</strong>: {{ formula.formula }}
        </div>
        <div>
          <button @click="editFormula(formula)" class="btn btn-sm btn-warning me-2">Редактировать</button>
          <button @click="deleteFormula(formula.id)" class="btn btn-sm btn-danger">Удалить</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFetch } from '#app'
const { fetchWithAuth } = useApi()

const formulas = ref([])

async function fetchFormulas() {
  try {
    const response = await fetchWithAuth('/api/formulas')
    formulas.value = response
  } catch (error) {
    console.error('Ошибка при получении формул:', error)
  }
}

fetchFormulas() // Вызываем функцию для первоначальной загрузки данных

const currentFormula = ref({ name: '', formula: '', variables: '{}' })
const isEditing = ref(false)

async function addOrUpdateFormula() {
  try {
    const payload = {
      ...currentFormula.value,
      variables: JSON.parse(currentFormula.value.variables) // Преобразуем строку в объект
    }

    if (isEditing.value) {
      await fetchWithAuth(`/api/formulas/${currentFormula.value.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await fetchWithAuth('/api/formulas', {
        method: 'POST',
        body: payload
      })
    }
    fetchFormulas() // Обновляем данные после изменения
    currentFormula.value = { name: '', formula: '', variables: '{}' }
    isEditing.value = false

  } catch (error) {
    console.error('Ошибка при добавлении/обновлении формулы:', error)
  }
}

function editFormula(formula) {
  currentFormula.value = {
    ...formula,
    variables: JSON.stringify(formula.variables) // Преобразуем объект в строку
  }
  isEditing.value = true
}

async function deleteFormula(id) {
  try {
    await fetchWithAuth(`/api/formulas/${id}`, { method: 'DELETE' })
    fetchFormulas() // Обновляем данные после удаления
  } catch (error) {
    console.error('Ошибка при удалении формулы:', error)
  }
}
</script>