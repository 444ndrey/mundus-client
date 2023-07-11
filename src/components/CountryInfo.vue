<template>
  <div class="country-wrapper">
    <div class="country-header">
      <h2>{{country.title}}</h2>
      <Button icon="pi pi-times" @click="onClose" text rounded aria-label="Cancel" />
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';

const emits = defineEmits(['close'])
const props = defineProps({
    country: {
        title: String,
        id: String
    }
});

function onClose(){
  emits('close');
}

</script>

<style scoped>
.country-wrapper {
  height: 600px;
  width: 500px;
  background-color: #fff;
  border-radius: 10px;
  -webkit-box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  -moz-box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  color: var(--base-font-color-light);
  padding: 10px;
}
.country-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>
