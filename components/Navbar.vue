<script setup lang="ts">
import { NuxtLink } from '#components';

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href="/">Мой склад</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <NuxtLink to="/supplies" class="nav-link">Приёмки</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/shipments" class="nav-link">Отгрузки</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/transfers" class="nav-link">Перемещения</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/prices" class="nav-link">Цены</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/users" class="nav-link">Пользователи</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/formulas" class="nav-link">Формулы</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/products" class="nav-link">Товары</NuxtLink>
          </li>
          <li class="nav-item">
            <NuxtLink to="/grades" class="nav-link">Сорта</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template> 