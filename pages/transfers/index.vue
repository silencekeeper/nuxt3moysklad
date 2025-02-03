<template>
  <div class="transfers-index">
    <h2>Список перемещений</h2>
    <table>
      <tr v-for="transfer in transfers" :key="transfer.id">
        <td>{{ transfer.name }}</td>
        <td>{{ transfer.date }}</td>
        <td>{{ transfer.status }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
  async function setup() {
    const { data: transfers } = await useFetch('/api/transfers')
    return { transfers }
  }
</script>
