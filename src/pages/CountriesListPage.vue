<template>
  <Button
    icon="pi pi-arrow-left"
    text
    rounded
    class="back-btn"
    v-tooltip="'Back to the map'"
    @click="() => router.push('/')"
  ></Button>
  <div class="list-wrapper">
    <ProgressSpinner class="spinner" v-if="isLoading" />
    <span class="p-input-icon-left list-search">
      <i class="pi pi-search" />
      <InputText v-model="searchValue" placeholder="Search" />
    </span>
    <DataTable
      :value="formatedCountries"
      v-if="!isLoading"
      scrollable
      scrollHeight="flex"
      stripedRows
    >
      <Column field="title" header="Name" sortable>
        <template #body="slotProps">
          <div class="list-title">
            <img
              class="list-title-flag"
              :src="slotProps.data.flag"
              :alt="slotProps.data.id"
            /><span>{{ slotProps.data.title }}</span>
          </div>
        </template>
      </Column>
      <Column field="id" header="Code"></Column>
      <Column field="population" header="Population" sortable>
        <template #body="slotProps">
          {{
            slotProps.data.population <= 0
              ? "no data"
              : formatNumber(slotProps.data.population)
          }}
        </template>
      </Column>
      <Column field="show">
        <template #body="slotProps">
          <Button text rounded @click="onClickShow(slotProps.data.id)"
            >Show</Button
          >
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import { watch, ref, onBeforeMount } from "vue";
import { getAllCountries } from "../api.js";
import ProgressSpinner from "primevue/progressspinner";
import { useRouter } from "vue-router";
import { formatNumber } from "../utils.js";
import InputText from "primevue/inputtext";

const isLoading = ref(true);
let countries = [];
const router = useRouter();
const searchValue = ref("");
onBeforeMount(async () => {
  countries = await getAllCountries();
  isLoading.value = false;
  formatedCountries.value = countries
});

function onClickShow(countryId) {
  router.push({ path: "/", query: { countryId: countryId } });
}
const formatedCountries = ref([]);


//Needs timeout because search blocks UI. It allows to make input more responsive.
watch(searchValue, async () => {
  let timeout;
  clearTimeout(timeout);
  timeout = setTimeout(find, 500);
  function find() {
    formatedCountries.value = countries.filter((c) =>
      c.title.toLowerCase().includes(searchValue.value.toLowerCase()) ||
      c.id.toLowerCase().includes(searchValue.value.toLowerCase())
    );
  }
});
</script>

<style scoped>
.list-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 800px;
  gap: 10px;
}
.list-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.list-title-flag {
  width: 40px;
  height: 25px;
  border: 1px solid var(--surface-200);
  border-radius: 15%;
}
.p-datatable {
  border-radius: 10px;
  flex: 1;
}
.back-btn {
  margin: 5px;
}
.list-search {
  align-self: flex-end;
}
</style>
