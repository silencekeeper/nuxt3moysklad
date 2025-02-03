<template>
  <div class="container">
    <h1>Добро пожаловать в МойСклад Аддон!</h1>
    <p>Это главная страница вашего приложения.</p>
    
    <div class="features">
      <div class="feature">
        <h2>Управление приёмками</h2>
        <p>Создавайте, просматривайте и редактируйте приёмки молока.</p>
        <nuxt-link to="/supplies" class="button">Перейти к приёмкам</nuxt-link>
      </div>
      
      <div class="feature">
        <h2>Управление перемещениями</h2>
        <p>Создавайте и отслеживайте перемещения товаров между складами.</p>
        <nuxt-link to="/transfers" class="button">Перейти к перемещениям</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Главная - МойСклад Аддон'
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.feature {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.feature h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 10px;
}
</style> 