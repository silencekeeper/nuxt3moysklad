<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useApi } from '../../utils/api'
import { useToast } from 'vue-toastification'

const { fetchWithAuth } = useApi()
const toast = useToast()

interface Store {
  id: string
  name: string
}

interface Supply {
  id: string
  moysklad_id: string
  store_name: string
  created_at: string
  counterparty_name: string
  counterparty_id: string
  milk_mass: number
  fat_percent: number
  protein_percent: number
  price: number
  fat_kg: number
  protein_kg: number
  vat_included: boolean
  store_id: string
  organization_id: string
  product_id: string
  product_name: string
  grade_id: string
  grade_name: string
}

interface Counterparty {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
}

interface Grade {
  id: string
  name: string
}

const stores = ref<Store[]>([])
const supplies = ref<Supply[]>([])
const selectedStore = ref('')
const startDate = ref('')
const endDate = ref('')
const selectedSupply = ref<Supply | null>(null)
const editedSupply = ref<Supply | null>(null)
const counterparties = ref<Counterparty[]>([])
const products = ref<Product[]>([])
const grades = ref<Grade[]>([])

const computedFatKg = computed(() => {
  if (editedSupply.value) {
    return (editedSupply.value.milk_mass * editedSupply.value.fat_percent / 100).toFixed(2)
  }
  return '0.00'
})

const computedProteinKg = computed(() => {
  if (editedSupply.value) {
    return (editedSupply.value.milk_mass * editedSupply.value.protein_percent / 100).toFixed(2)
  }
  return '0.00'
})

const groupedSupplies = computed(() => {
  return supplies.value.reduce((acc: Record<string, Record<string, Supply[]>>, supply) => {
    const date = supply.created_at.split('T')[0] // Извлекаем только дату
    const store = supply.store_name

    if (!acc[date]) {
      acc[date] = {}
    }
    if (!acc[date][store]) {
      acc[date][store] = []
    }
    acc[date][store].push(supply)

    return acc
  }, {} as Record<string, Record<string, Supply[]>>)
})

onMounted(async () => {
  console.log('onMounted')
 //if (!startDate.value) {
 //   const today = new Date().toISOString().split('T')[0];
 //   startDate.value = today;
 //   endDate.value = today;
 // }
  await loadStores()
  await loadSupplies()
  await loadCounterparties()
  await loadProducts()
  await loadGrades()
})

async function loadStores() {
  const data = await fetchWithAuth('/api/warehouses') as Store[];
  stores.value = data;
}

async function loadSupplies() {
  const params = {
    store: selectedStore.value,
    start_date: startDate.value,
    end_date: endDate.value
  }
  try {
    const data = await fetchWithAuth('/api/supplies', { params }) as { supplies: Supply[], today: string };
    console.log(data)
    supplies.value = data.supplies
    
    if (!startDate.value) {
      startDate.value = data.today
    }
    if (!endDate.value) {
      endDate.value = data.today
    }
    
   // const  data  = await fetchWithAuth<{ supplies: Supply[], today: string }>('/api/supplies', { params })
   // console.log(data)
   // supplies.value = data.supplies
    
   // if (!startDate.value) {
   //   startDate.value = data.today
   // }
   // if (!endDate.value) {
   //   endDate.value = data.today
   // }
  } catch (error) {
    console.error('Ошибка загрузки данных о приёмках:', error)
  }
}

async function loadCounterparties() {
  const data = await fetchWithAuth('/api/counterparties') as Counterparty[];
  counterparties.value = data;
}

async function loadProducts() {
  const data = await fetchWithAuth('/api/products') as Product[];
  products.value = data;
}

async function loadGrades() {
  const data = await fetchWithAuth('/api/grades') as Grade[];
  grades.value = data;
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU')
}

async function showSupplyDetails(supplyId: string) {
  const data = await fetchWithAuth(`/api/supplies/${supplyId}`) as Supply;
  selectedSupply.value = data;
}

async function deleteSupply(supplyId: string) {
  try {
    await fetchWithAuth(`/api/supplies/${supplyId}`, { method: 'DELETE' })
    supplies.value = supplies.value.filter(s => s.id !== supplyId)
  } catch (error) {
    console.error('Ошибка при удалении приёмки:', error)
    // Показать уведомление об ошибке
  }
}

function editSupply(supply: Supply | null) {
  if (!supply) {
    console.error('Попытка редактирования несуществующей приёмки')
    return
  }
  editedSupply.value = { ...supply }
}

function updateCounterpartyName() {
  if (editedSupply.value) {
    const selectedCounterparty = counterparties.value.find(c => c.id === editedSupply.value.counterparty_id)
    if (selectedCounterparty) {
      editedSupply.value.counterparty_name = selectedCounterparty.name
    }
  }
}

function updateStoreName() {
  if (editedSupply.value) {
    const selectedStore = stores.value.find(s => s.id === editedSupply.value.store_id)
    if (selectedStore) {
      editedSupply.value.store_name = selectedStore.name
    }
  }
}

function updateProductName() {
  if (editedSupply.value) {
    const selectedProduct = products.value.find(p => p.id === editedSupply.value.product_id)
    if (selectedProduct) {
      editedSupply.value.product_name = selectedProduct.name
    }
  }
}

function updateGradeName() {
  if (editedSupply.value) {
    const selectedGrade = grades.value.find(g => g.id === editedSupply.value.grade_id)
    if (selectedGrade) {
      editedSupply.value.grade_id = selectedGrade.id
      editedSupply.value.grade_name = selectedGrade.name
    }
  }
}


async function validateSupply(supply: Supply) {
  const errors = []

  if (!supply.created_at) {
    errors.push('Дата и время не могут быть пустыми.')
  }
  if (!supply.counterparty_id) {
    errors.push('Контрагент должен быть выбран.')
  }
  if (!supply.store_id) {
    errors.push('Склад должен быть выбран.')
  }
  if (!supply.product_id) {
    errors.push('Товар должен быть выбран.')
  }
  if (!supply.grade_id) {
    errors.push('Сорт должен быть выбран.')
  }
  if (!supply.milk_mass || supply.milk_mass <= 0) {
    errors.push('Масса должна быть больше нуля.')
  }
  if (!supply.fat_percent || supply.fat_percent < 0) {
    errors.push('Процент жира должен быть указан.')
  }
  if (!supply.protein_percent || supply.protein_percent < 0) {
    errors.push('Процент белка должен быть указан.')
  }
  if (supply.price === 0) {
    errors.push('Ценовое соглашение не найдено, проверьте данные.')
  }

  return errors
}

async function updateSupply() {
  if (editedSupply.value) {
    const errors = await validateSupply(editedSupply.value)
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return
    }

    const selectedCounterparty = counterparties.value.find(c => c.id === editedSupply.value?.counterparty_id)
    if (selectedCounterparty) {
      editedSupply.value.counterparty_name = selectedCounterparty.name
    }

    const selectedStore = stores.value.find(s => s.id === editedSupply.value?.store_id)
    if (selectedStore) {
      editedSupply.value.store_name = selectedStore.name
    }

    const selectedProduct = products.value.find(p => p.id === editedSupply.value?.product_id)
    if (selectedProduct) {
      editedSupply.value.product_name = selectedProduct.name
    }

    const selectedGrade = grades.value.find(g => g.id === editedSupply.value?.grade_id)
    if (selectedGrade) {
      editedSupply.value.grade_name = selectedGrade.name
    }

    const price = await fetchPrice(
      editedSupply.value.organization_id as string,
      editedSupply.value.counterparty_id as string,
      editedSupply.value.product_id,
      editedSupply.value.grade_id,
      editedSupply.value.created_at
    )

    if (price === 0) {
      return
    }

    const updatedSupply = await fetchWithAuth(`/api/supplies/${editedSupply.value.id}`, {
      method: 'PUT',
      body: JSON.stringify(editedSupply.value)
    }) as Supply

    const index = supplies.value.findIndex(s => s.id === updatedSupply.id)
    if (index !== -1) {
      supplies.value[index] = updatedSupply
    }
    closeEditModal()
  }
}

function closeEditModal() {
  editedSupply.value = null
}

// Функция для получения цены
async function fetchPrice(organization_id: string, counterparty_id: string, product_id: string, grade_id: string, date: string) {
  try {
    const response = await fetchWithAuth(`/api/pricing_agreements?organization_id=${organization_id}&counterparty_id=${counterparty_id}&product_id=${product_id}&grade_id=${grade_id}&date=${date}`) as any[]
    if (response.length > 0) {
      return response[0].base_price
    } else {
      toast.error('Ценовое соглашение не найдено')
      return 0
    }
  } catch (error) {
    console.error('Ошибка при получении цены:', error)
    return 0
  }
}

// Наблюдатели за изменениями
watch(
  [() => editedSupply.value?.created_at, () => editedSupply.value?.counterparty_id, () => editedSupply.value?.product_id, () => editedSupply.value?.grade_id],
  async ([newDate, newCounterparty, newProduct, newGrade]) => {
    if (editedSupply.value && newDate && newCounterparty && newProduct && newGrade) {
      const price = await fetchPrice(editedSupply.value.organization_id, newCounterparty, newProduct, editedSupply.value.grade_id, newDate)
      if (price !== null) {
        editedSupply.value.price = price
      } else {
        console.warn('Ценовое соглашение не найдено')
      }
    }
  }
)
</script>

<template>
  <div>
    <div class="row mb-4 align-items-center">
      <div class="col">
        <h1>Список приёмок</h1>
      </div>
      <div class="col text-end">
        <nuxt-link to="/supplies/create" class="btn btn-primary">Создать приёмку</nuxt-link>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4">
        <div class="mb-3">
          <label for="storeFilter" class="form-label">Фильтр по складу:</label>
          <select id="storeFilter" class="form-select" v-model="selectedStore" @change="loadSupplies">
            <option value="">Все склады</option>
            <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
          </select>
        </div>
      </div>
      <div class="col-md-4">
        <div class="mb-3">
          <label for="startDate" class="form-label">Начальная дата:</label>
          <input type="date" id="startDate" class="form-control" v-model="startDate" @change="loadSupplies">
        </div>
      </div>
      <div class="col-md-4">
        <div class="mb-3">
          <label for="endDate" class="form-label">Конечная дата:</label>
          <input type="date" id="endDate" class="form-control" v-model="endDate" @change="loadSupplies">
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Склад</th>
            <th>Дата</th>
            <th>Контрагент</th>
            <th>Товар</th>
            <th>Масса</th>
            <th>Жир, %</th>
            <th>Белок, %</th>
            <th>Цена</th>
            <th>Жир, кг</th>
            <th>Белок, кг</th>
            <th>Сорт</th>
            <th>НДС включен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dateGroup, date) in groupedSupplies" :key="date">
            <td colspan="13"><strong>{{ date }}</strong></td>
          </tr>
          <tr v-for="(storeGroup, storeName) in dateGroup" :key="storeName">
            <td colspan="13" class="ps-4"><strong>{{ storeName }}</strong></td>
          </tr>
          <tr v-for="supply in storeGroup" :key="supply.id">
            <td>{{ supply.store_name }}</td>
            <td>{{ formatDate(supply.created_at) }}</td>
            <td>{{ supply.counterparty_name }}</td>
            <td>{{ supply.product_name }}</td>
            <td>{{ supply.milk_mass }}</td>
            <td>{{ supply.fat_percent }}</td>
            <td>{{ supply.protein_percent }}</td>
            <td>{{ supply.price }}</td>
            <td>{{ supply.fat_kg }}</td>
            <td>{{ supply.protein_kg }}</td>
            <td>{{ supply.grade_name }}</td>
            <td>{{ supply.vat_included ? 'Да' : 'Нет' }}</td>
            <td>
              <button class="btn btn-sm btn-danger me-2" @click="deleteSupply(supply.id)">Удалить</button>
              <button class="btn btn-sm btn-primary" @click="editSupply(supply)">Редактировать</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно с деталями приёмки -->
    <div class="modal fade" id="supplyDetailsModal" tabindex="-1" aria-labelledby="supplyDetailsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" v-if="selectedSupply">
          <div class="modal-header">
            <h5 class="modal-title" id="supplyDetailsModalLabel">Приёмка {{ selectedSupply.id }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Отображение деталей приёмки -->
            <!-- ... -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" :class="{ 'd-block': editedSupply }">
      <div class="modal-dialog">
        <div class="modal-content" v-if="editedSupply">
          <div class="modal-header">
            <h5 class="modal-title">Редактирование приёмки</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="editDateTime" class="form-label">Дата и время</label>
                <input type="datetime-local" class="form-control" id="editDateTime" v-model="editedSupply.created_at" required>
              </div>
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="editCounterparty" class="form-label">Контрагент</label>
                  <select class="form-select" id="editCounterparty" v-model="editedSupply.counterparty_id" @change="updateCounterpartyName" required>
                    <option v-for="counterparty in counterparties" :key="counterparty.id" :value="counterparty.id">{{ counterparty.name }}</option>
                  </select>
                </div>
              </div>
              <div class="col-md-6">
                <label for="editStore" class="form-label">Склад</label>
                <select class="form-select" id="editStore" v-model="editedSupply.store_id" @change="updateStoreName" required>
                  <option v-for="store in stores" :key="store.id" :value="store.id">{{ store.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="editProduct" class="form-label">Товар</label>
                <select class="form-select" id="editProduct" v-model="editedSupply.product_id" @change="updateProductName" required>
                  <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}</option>
                </select>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-2">
                <label for="editMass" class="form-label">Масса, кг</label>
                <input type="number" class="form-control" id="editMass" v-model.number="editedSupply.milk_mass" min="0" required>
              </div>
              <div class="col-md-2">
                <label for="editFatPercent" class="form-label">Жир, %</label>
                <input type="number" class="form-control" id="editFatPercent" v-model.number="editedSupply.fat_percent" min="0" max="100" step="0.01" required>
              </div>
              <div class="col-md-2">
                <label class="form-label">Жир, кг</label>
                <input type="number" class="form-control" :value="computedFatKg" readonly>
              </div>
              <div class="col-md-2">
                <label for="editProteinPercent" class="form-label">Белок, %</label>
                <input type="number" class="form-control" id="editProteinPercent" v-model.number="editedSupply.protein_percent" min="0" max="100" step="0.01" required>
              </div>
              <div class="col-md-2">
                <label class="form-label">Белок, кг</label>
                <input type="number" class="form-control" :value="computedProteinKg" readonly>
              </div>
              <div class="col-md-2">
                <label for="editPrice" class="form-label">Цена, руб.</label>
                <input type="number" class="form-control" :class="{ 'is-invalid': editedSupply && editedSupply.price === 0 }" id="editPrice" v-model.number="editedSupply.price" required readonly>
              </div>
            </div>
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="editGrade" class="form-label">Сорт</label>
                <select class="form-select" id="editGrade" v-model="editedSupply.grade_id" @change="updateGradeName" required>
                  <option v-for="grade in grades" :key="grade.id" :value="grade.id">{{ grade.name }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Отмена</button>
            <button type="button" class="btn btn-primary" @click="updateSupply">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal.d-block {
  display: block;
}

.is-invalid {
  border-color: red;
}
</style>
