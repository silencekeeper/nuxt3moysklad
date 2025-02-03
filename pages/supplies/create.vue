<template>
  <div class="container">
    <h1 class="my-4">Создать новую приёмку</h1>
    <form @submit.prevent="createSupply">
      <div class="mb-3">
        <label for="moment" class="form-label">Дата приёмки:</label>
        <input type="datetime-local" id="moment" class="form-control" v-model="supply.moment" required>
      </div>
      
      <div class="mb-3">
        <label for="organization" class="form-label">Организация:</label>
        <select id="organization" class="form-select" v-model="supply.organization" required>
          <option v-for="org in organizations" :key="org.id" :value="org.id">{{ org.name }}</option>
        </select>
        <button type="button" class="btn btn-secondary mt-2" @click="refreshOrganizations">Обновить</button>
      </div>
      
      <div class="mb-3">
        <label for="store" class="form-label">Склад:</label>
        <select id="store" class="form-select" v-model="supply.store" required>
          <option v-for="w in warehouses" :key="w.id" :value="w.id">{{ w.name }}</option>
        </select>
        <button type="button" class="btn btn-secondary mt-2" @click="refreshWarehouses">Обновить</button>
      </div>
      
      <button type="button" class="btn btn-secondary mb-4" @click="refreshCounterparties">Обновить список контрагентов</button>

      <h2>Позиции</h2>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Контрагент</th>
            <th>Наименование</th>
            <th>Масса, кг</th>
            <th>Жир, %</th>
            <th>Ж/кг</th>
            <th>Белок, %</th>
            <th>Б/кг</th>
            <th>Цена, руб</th>
            <th>НДС</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(position, index) in supply.positions" :key="index">
            <td>
              <select class="form-select" v-model="position.counterparty" required>
                <option value="">Выберите контрагента</option>
                <option v-for="c in counterparties" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </td>
            <td>
              <select class="form-select" v-model="position.product" required>
                <option value="">Выберите тип</option>
                <option value="Обрат">Обрат</option>
                <option value="Молоко сырое">Молоко сырое</option>
              </select>
            </td>
            <td><input type="number" class="form-control" v-model.number="position.mass" min="0" max="999999" step="1" required></td>
            <td><input type="number" class="form-control" v-model.number="position.fat" min="0" max="5" step="0.01" required></td>
            <td><input type="number" class="form-control" v-model.number="position.fatKg" readonly></td>
            <td><input type="number" class="form-control" v-model.number="position.protein" min="0" max="5" step="0.01" required></td>
            <td><input type="number" class="form-control" v-model.number="position.proteinKg" readonly></td>
            <td><input type="number" class="form-control" v-model.number="position.price" readonly></td>
            <td class="text-center"><input type="checkbox" v-model="position.vat"></td>
            <td><button type="button" class="btn btn-danger" @click="removePosition(index)">Удалить</button></td>
          </tr>
        </tbody>
      </table>
      
      <button type="button" class="btn btn-primary me-2" @click="addPosition">Добавить позицию</button>
      <button type="submit" class="btn btn-success">Создать приёмку</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useApi } from '~/utils/api'
import { useToast } from 'vue-toastification'

const { fetchWithAuth } = useApi()
const toast = useToast()

const organizations = ref([])
const warehouses = ref([])
const counterparties = ref([])

const supply = reactive({
  moment: '',
  organization: '',
  store: '',
  positions: []
})

async function loadOrganizations() {
  const data = await fetchWithAuth('/api/organizations')
  console.log("loadOrganizations", data)
  organizations.value = data
}

async function loadWarehouses() {
  const  data  = await fetchWithAuth('/api/warehouses')
  warehouses.value = data
}

async function loadCounterparties() {
  const  data  = await fetchWithAuth('/api/counterparties')
  counterparties.value = data
}

async function refreshOrganizations() {
  await fetchWithAuth('/api/update_organizations', { method: 'POST' })
  await loadOrganizations()
}

async function refreshWarehouses() {
  await fetchWithAuth('/api/update_warehouses', { method: 'POST' })
  await loadWarehouses()
}

async function refreshCounterparties() {
  await fetchWithAuth('/api/update_counterparties', { method: 'POST' })
  await loadCounterparties()
}

function addPosition() {
  supply.positions.push({
    counterparty: '',
    product: '',
    mass: 0,
    fat: 0,
    fatKg: 0,
    protein: 0,
    proteinKg: 0,
    price: 0,
    vat: false
  })
}

function removePosition(index) {
  supply.positions.splice(index, 1)
}

watch(() => supply.positions, (positions) => {
  positions.forEach(pos => {
    pos.fatKg = (pos.mass * pos.fat / 100).toFixed(2)
    pos.proteinKg = (pos.mass * pos.protein / 100).toFixed(2)
  })
}, { deep: true })

watch(
  [() => supply.organization, () => supply.moment, () => supply.positions.map(pos => pos.counterparty)],
  async ([organization_id, newDate, newCounterparties]) => {
    if (organization_id && newDate) {
      for (let i = 0; i < supply.positions.length; i++) {
        const counterpartyId = newCounterparties[i];
        if (counterpartyId) {
          const price = await fetchPrice(organization_id, counterpartyId, newDate);
          supply.positions[i].price = price;
        }
      }
    }
  },
  { deep: true, immediate: true }
);

async function fetchPrice(organization_id, counterpartyId, date) {
  try {
    const response = await fetchWithAuth(`/api/pricing_agreements?organization_id=${organization_id}&counterparty_id=${counterpartyId}&date=${date}`);
    console.log('response', response);
    if (response.length === 0) {
      console.warn('Нет ценового соглашения для данного контрагента на выбранную дату');
      return null;
    }
    return response[0].base_price;
  } catch (error) {
    console.error('Ошибка при получении цены:', error);
    return null;
  }
}

async function createSupply() {
  const suppliesByCounterparty = {};
  console.log("createSupply");
  let canSave = true;

  supply.positions.forEach(pos => {
    console.log(supply)
    console.log('supply moment',supply.moment)
    console.log('Organization.meta.href',supply.organization)
    if (pos.price === 0 || pos.price === null) {
      toast.error(`По контрагенту ${pos.counterparty} отсутствует ценовое соглашение на выбранную дату.`)
      canSave = false;
      return;
    }

    const counterpartyId = pos.counterparty;
    if (!suppliesByCounterparty[counterpartyId]) {
      suppliesByCounterparty[counterpartyId] = {
        moment: supply.moment,
        organization: {
          meta: {
            href: `https://api.moysklad.ru/api/remap/1.2/entity/organization/${supply.organization}`,
            type: "organization",
            mediaType: "application/json",
            id: supply.organization
          }
        },
        store: {
          meta: {
            href: `https://api.moysklad.ru/api/remap/1.2/entity/store/${supply.store}`,
            type: "store",
            mediaType: "application/json",
            id: supply.store
          }
        },
        agent: {
          meta: {
            href: `https://api.moysklad.ru/api/remap/1.2/entity/counterparty/${counterpartyId}`,
            type: "counterparty",
            mediaType: "application/json",
            id: counterpartyId
          }
        },
        vatEnabled: pos.vat,
        vatIncluded: pos.vat,
        mass: pos.mass,
        fat: pos.fat,
        fatKg: pos.fatKg,
        protein: pos.protein,
        proteinKg: pos.proteinKg,
        price: pos.price
      };
    }
  });

  if (!canSave) {
    return;
  }

  try {
    await fetchWithAuth('/api/supplies', {
      method: 'POST',
      body: Object.values(suppliesByCounterparty)
    });
    toast.success('Приёмки успешно созданы!')
    navigateTo('/supplies');
  } catch (error) {
    console.error('Ошибка при создании приёмок:', error);
    toast.error('Ошибка при создании приёмок');
  }
}

loadOrganizations()
loadWarehouses()
loadCounterparties()
</script>

<style scoped>
/* Ваши стили */
</style>