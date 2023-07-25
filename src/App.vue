<template>
  <div class="layout">
    <AppMenu />
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import AppMenu from "./components/AppMenu.vue";
</script>

<style scoped>
.layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.main {
  position: relative;
  height: 100%;
}

@media (max-width: 680px) {
  .main {
    overflow-y: hidden;
  }
}
</style>
