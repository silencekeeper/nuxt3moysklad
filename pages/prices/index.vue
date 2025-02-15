<template>
  <div class="container mt-5">
    <h1 class="mb-4">Управление Ценовыми Соглашениями</h1>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Дата</th>
          <th>Контрагент</th>
          <th>Организация</th>
          <th>Цена</th>
          <th>Формула</th>
          <th>НДС включен</th>
          <th>НДС</th>
          <th>Продукт</th>
          <th>Сорт</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="agreement in agreements" :key="agreement.id">
          <td>{{ agreement.id }}</td>
          <td>{{ agreement.agreement_date }}</td>
          <td>{{ getCounterpartyName(agreement.counterparty_id) }}</td>
          <td>{{ getOrganizationName(agreement.organization_id) }}</td>
          <td>{{ agreement.base_price }}</td>
          <td>{{ getFormulaName(agreement.formula_id) }}</td>
          <td>{{ agreement.vat_included ? 'Да' : 'Нет' }}</td>
          <td>{{ agreement.vat_enabled ? 'Да' : 'Нет' }}</td>
          <td>{{ getProductName(agreement.product_id) }}</td>
          <td>{{ getGradeName(agreement.grade_id) }}</td>
          
          <td>
            <button @click="editAgreement(agreement)" class="btn btn-sm btn-warning me-2">Редактировать</button>
            <button @click="deleteAgreement(agreement.id)" class="btn btn-sm btn-danger">Удалить</button>
          </td>
        </tr>
        <tr>
          <td>Новый</td>
          <td><input type="date" v-model="currentAgreement.agreement_date" class="form-control" required /></td>
          <td>
            <select v-model="currentAgreement.counterparty_id" class="form-control" required>
              <option value="" disabled>Выберите контрагента</option>
              <option v-for="counterparty in counterparties" :key="counterparty.id" :value="counterparty.id">
                {{ counterparty.name }}
              </option>
            </select>
          </td>
          <td>
            <select v-model="currentAgreement.organization_id" class="form-control" required>
              <option value="" disabled>Выберите организацию</option>
              <option v-for="organization in organizations" :key="organization.id" :value="organization.id">
                {{ organization.name }}
              </option>
            </select>
          </td>
          <td><input type="number" v-model="currentAgreement.base_price" class="form-control" required min="0.00"/></td>
          <td>
            <select v-model="currentAgreement.formula_id" class="form-control" required>
              <option value="" disabled>Выберите формулу</option>
              <option v-for="formula in formulas" :key="formula.id" :value="formula.id">
                {{ formula.name }}
              </option>
            </select>
          </td>
          <td><input type="checkbox" v-model="currentAgreement.vat_included" /></td>
          <td><input type="checkbox" v-model="currentAgreement.vat_enabled" /></td>
          <td>
            <select v-model="currentAgreement.product_id" class="form-control" required>
              <option value="" disabled>Выберите продукт</option>
              <option v-for="product in products" :key="product.id" :value="product.id">
                {{ product.name }}
              </option>
            </select>
          </td>
          <td>
            <select v-model="currentAgreement.grade_id" class="form-control" required>
              <option value="" disabled>Выберите сорт</option>
              <option v-for="grade in grades" :key="grade.id" :value="grade.id">
                {{ grade.name }}
              </option>
            </select>
          </td>
          <td>
            <button @click="addOrUpdateAgreement" class="btn btn-sm btn-success">Добавить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'
import { useToast } from 'vue-toastification'

const { fetchWithAuth } = useApi()
const toast = useToast()

const agreements = ref([])
const counterparties = ref([])
const formulas = ref([])
const organizations = ref([])
const products = ref([])
const grades = ref([])

const currentAgreement = ref({
  counterparty_id: '',
  formula_id: '',
  agreement_date: '',
  organization_id: '',
  base_price: 0,
  vat_included: false,
  vat_enabled: false,
  product_id: '',
  grade_id: ''
})
const isEditing = ref(false)

async function fetchAgreements() {
  try {
    const response = await fetchWithAuth('/api/pricing_agreements')
    agreements.value = response
    console.log(agreements.value)
  } catch (error) {
    console.error('Ошибка при получении ценовых соглашений:', error)
  }
}

async function fetchCounterparties() {
  try {
    const response = await fetchWithAuth('/api/counterparties')
    counterparties.value = response
  } catch (error) {
    console.error('Ошибка при получении контрагентов:', error)
  }
}

async function fetchFormulas() {
  try {
    const response = await fetchWithAuth('/api/formulas')
    formulas.value = response
  } catch (error) {
    console.error('Ошибка при получении формул:', error)
  }
}

async function fetchOrganizations() {
  try {
    const response = await fetchWithAuth('/api/organizations')
    organizations.value = response
  } catch (error) {
    console.error('Ошибка при получении организаций:', error)
  }
}

async function fetchProducts() {
  try {
    const response = await fetchWithAuth('/api/products')
    products.value = response
  } catch (error) {
    console.error('Ошибка при получении товаров:', error)
  }
}

async function fetchGrades() {
  try {
    const response = await fetchWithAuth('/api/grades')
    grades.value = response
  } catch (error) {
    console.error('Ошибка при получении сортов:', error)
  }
}

onMounted(() => {
  fetchAgreements()
  fetchCounterparties()
  fetchFormulas()
  fetchOrganizations()
  fetchProducts()
  fetchGrades()
})

function validateAgreement(agreement) {
  const errors = []

  if (!agreement.agreement_date) {
    errors.push('Дата соглашения не может быть пустой.')
  }
  if (!agreement.counterparty_id) {
    errors.push('Контрагент должен быть выбран.')
  }
  if (!agreement.organization_id) {
    errors.push('Организация должна быть выбрана.')
  }
  if (!agreement.base_price || agreement.base_price <= 0) {
    errors.push('Цена должна быть больше нуля.')
  }
  if (!agreement.formula_id) {
    errors.push('Формула должна быть выбрана.')
  }
  if (!agreement.product_id) {
    errors.push('Продукт должен быть выбран.')
  }
  if (!agreement.grade_id) {
    errors.push('Сорт должен быть выбран.')
  }

  return errors
}

async function addOrUpdateAgreement() {
  const errors = validateAgreement(currentAgreement.value)
  if (errors.length > 0) {
    errors.forEach(error => toast.error(error))
    return
  }

  try {
    if (isEditing.value) {
      await fetchWithAuth(`/api/pricing_agreements/${currentAgreement.value.id}`, {
        method: 'PUT',
        body: currentAgreement.value
      })
    } else {
      await fetchWithAuth('/api/pricing_agreements', {
        method: 'POST',
        body: currentAgreement.value
      })
    }
    fetchAgreements()
    currentAgreement.value = {
      counterparty_id: '',
      formula_id: '',
      agreement_date: '',
      organization_id: '',
      base_price: 0,
      vat_included: false,
      vat_enabled: false,
      product_id: '',
      grade_id: ''
    }
    isEditing.value = false
  } catch (error) {
    toast.error('Ошибка при добавлении/обновлении соглашения')
    console.error('Ошибка при добавлении/обновлении соглашения:', error)
  }
}

function editAgreement(agreement) {
  currentAgreement.value = { ...agreement }
  isEditing.value = true
}

async function deleteAgreement(id) {
  try {
    await fetchWithAuth(`/api/pricing_agreements/${id}`, { method: 'DELETE' })
    fetchAgreements()
  } catch (error) {
    console.error('Ошибка при удалении соглашения:', error)
  }
}

function getCounterpartyName(id) {
  const counterparty = counterparties.value.find(c => c.id === id)
  return counterparty ? counterparty.name : 'Неизвестный контрагент'
}

function getOrganizationName(id) {
  const organization = organizations.value.find(o => o.id === id)
  return organization ? organization.name : 'Неизвестная организация'
}

function getFormulaName(id) {
  const formula = formulas.value.find(f => f.id === id)
  return formula ? formula.name : 'Неизвестная формула'
}

function getProductName(id) {
  const product = products.value.find(p => p.id === id)
  return product ? product.name : 'Неизвестный продукт'
}

function getGradeName(id) {
  const grade = grades.value.find(g => g.id === id)
  return grade ? grade.name : 'Неизвестный сорт'
}

</script> 