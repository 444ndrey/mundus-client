<template>
  <header class="wrapper">
    <h2 @click="onChangeTheme">MUNDUS</h2>
  </header>
</template>

<script setup>
import { usePrimeVue } from "primevue/config";
import { onBeforeMount, watch, ref } from "vue";
import { getTheme, storeTheme } from "../cache_storage.js";

let isDark = ref(false);
const PrimeVue = usePrimeVue();
const theme = getTheme();

watch(isDark, () => {
  console.log("ds");
  if (!isDark.value) {
    PrimeVue.changeTheme(
      "md-dark-indigo",
      "md-light-indigo",
      "md-indigo-link",
      () => {}
    );
    storeTheme("light");
  } else {
    PrimeVue.changeTheme(
      "md-light-indigo",
      "md-dark-indigo",
      "md-indigo-link",
      () => {}
    );
    storeTheme("dark");
  }
});
function onChangeTheme() {
  isDark.value = !isDark.value;
}

onBeforeMount(() => {
  if (theme === "dark") {
    isDark.value = true;
  }
});
</script>

<style scoped>
.wrapper {
  width: 100%;
  padding: 20px;
  align-items: center;
  -webkit-box-shadow: 0px 14px 26px -6px rgba(110, 99, 174, 0.21);
  -moz-box-shadow: 0px 14px 26px -6px rgba(110, 99, 174, 0.21);
  box-shadow: 0px 14px 26px -6px rgba(110, 99, 174, 0.21);
  display: flex;
  justify-content: center;
  background-color: var(--bg-color);
}
.wrapper > h2 {
  user-select: none;
  cursor: pointer;
  color: var(--surface-800);
  transition: 0.3s ease-in;
  letter-spacing: 5px;
}
.wrapper > h2:hover {
  text-shadow: 0 5px 30px var(--primary-color);
  filter: contrast(200%);
}



@media (max-width: 680px){
  .wrapper{
    padding: 10px;
  }
  .wrapper > h2{
    font-size: 18px;
  }
}

</style>
