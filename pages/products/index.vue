<template>
  <div class="container mt-5">
    <h1 class="mb-4">Управление Товарами</h1>
    <form @submit.prevent="addOrUpdateProduct" class="mb-4">
      <div class="mb-3">
        <input v-model="currentProduct.name" class="form-control" placeholder="Название товара" required />
      </div>
      <div class="mb-3">
        <input v-model="currentProduct.code" class="form-control" placeholder="Код товара" required />
      </div>
      <div class="mb-3">
        <textarea v-model="currentProduct.description" class="form-control" placeholder="Описание товара"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">{{ isEditing ? 'Обновить' : 'Добавить' }} Товар</button>
    </form>

    <ul class="list-group">
      <li v-for="product in products" :key="product.id" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <strong>{{ product.name }}</strong> ({{ product.code }}): {{ product.description }}
        </div>
        <div>
          <button @click="editProduct(product)" class="btn btn-sm btn-warning me-2">Редактировать</button>
          <button @click="deleteProduct(product.id)" class="btn btn-sm btn-danger">Удалить</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'
const { fetchWithAuth } = useApi()

const products = ref([])

async function fetchProducts() {
  try {
    const response = await fetchWithAuth('/api/products')
    products.value = response
  } catch (error) {
    console.error('Ошибка при получении товаров:', error)
  }
}

fetchProducts() // Вызываем функцию для первоначальной загрузки данных

const currentProduct = ref({ name: '', code: '', description: '' })
const isEditing = ref(false)

async function addOrUpdateProduct() {
  try {
    if (isEditing.value) {
      await fetchWithAuth(`/api/products/${currentProduct.value.id}`, {
        method: 'PUT',
        body: currentProduct.value
      })
    } else {
      await fetchWithAuth('/api/products', {
        method: 'POST',
        body: currentProduct.value
      })
    }
    fetchProducts() // Обновляем данные после изменения
    currentProduct.value = { name: '', code: '', description: '' }
    isEditing.value = false

  } catch (error) {
    console.error('Ошибка при добавлении/обновлении товара:', error)
  }
}

function editProduct(product) {
  currentProduct.value = { ...product }
  isEditing.value = true
}

async function deleteProduct(id) {
  try {
    await fetchWithAuth(`/api/products/${id}`, { method: 'DELETE' })
    fetchProducts() // Обновляем данные после удаления
  } catch (error) {
    console.error('Ошибка при удалении товара:', error)
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style> 