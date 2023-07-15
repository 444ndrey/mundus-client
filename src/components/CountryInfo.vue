<template>
  <div class="country-wrapper">
    <div class="country-header">
      <Button
        icon="pi pi-times"
        @click="onClose"
        text
        rounded
        aria-label="Cancel"
      />
    </div>
    <ProgressSpinner class="spinner" v-if="isLodaing" />
    <div class="country-info" v-else>
      <div class="country-title">
        <h2>{{ countryData.title }}</h2>
        <img
          class="country-info-flag"
          :src="countryData.flag"
          :alt="countryData.altFlag"
        />
      </div>
      <TabView>
        <TabPanel header="Brief">
          <p class="country-tab-content-field">
            <label>Population: </label
            >{{ formatNumber(countryData.population) }}
          </p>
          <p class="country-tab-content-field">
            <label>Capital: </label>{{ countryData.capital }}
          </p>
          <p class="country-tab-content-field">
            <label>Curency: </label>{{ countryData.curency.name }}({{
              countryData.curency.symbol
            }})
          </p>
        </TabPanel>
        <TabPanel header="Economic"> </TabPanel>
        <TabPanel header="News"> </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { getCountryInfo } from "../api.js";
import { onMounted, ref } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { formatNumber } from "../utils.js";
import { storeCountry, getCountryFromStorage } from "../cache_storage.js";

const isLodaing = ref(true);
const emits = defineEmits(["close"]);
const props = defineProps({
  country: {
    title: String,
    id: String,
  },
});

const countryData = ref(null);

onMounted(async () => {
  const countryFromStorage = await getCountryFromStorage(props.country.id);
  if (countryFromStorage === null) {
    countryData.value = await getCountryInfo(props.country.id);
    if (countryData.value) {
      await storeCountry(countryData.value);
    }
  }else{
    countryData.value = countryFromStorage;
    console.log('FROM CACHE');
  }
  console.log(countryData.value)
  isLodaing.value = false;
});

function onClose() {
  emits("close");
}
</script>

<style scoped>
.country-wrapper {
  height: 600px;
  width: 500px;
  background-color: #fff;
  border-radius: 10px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  -webkit-box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  -moz-box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  color: var(--base-font-color-light);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.country-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.spinner {
  margin: auto;
  stroke: var(--primary-color) !important;
}

.country-info {
  margin-top: 20px;
}
.country-info-flag {
  max-width: 100px;
  max-height: 70px;
  border: 1px solid var(--base-font-color-light);
}
.country-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.country-title > h2 {
  align-self: flex-end;
}
.country-tab-content-field {
  margin-bottom: 20px;
  font-weight: 500;
}
.country-tab-content-field > label {
  font-weight: 400;
}
</style>
