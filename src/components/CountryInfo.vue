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
            >{{ formatNumber(fromatedCountryData.population) }}
          </p>
          <p class="country-tab-content-field">
            <label>Capital: </label>{{ fromatedCountryData.capital }}
          </p>
          <p class="country-tab-content-field">
            <label>Curency: </label>{{ fromatedCountryData.curency.name }}({{
              fromatedCountryData.curency.symbol
            }})
          </p>
        </TabPanel>
        <TabPanel header="Economic">
          <div class="panel-info">
            <CurrencyExchager :currencyCode="countryData.currencyCode" />
            <Divider/>
            <p class="country-tab-content-field"><label>GDP: </label>{{fromatedCountryData.gdp}}</p>
            <p class="country-tab-content-field"><label>GDP Per Captia: </label>{{fromatedCountryData.gdpPerCaptia}}</p>
            <p class="country-tab-content-field"><label>Imports: </label>{{fromatedCountryData.imports}}</p>
            <p class="country-tab-content-field"><label>Exports: </label>{{fromatedCountryData.exports}}</p>
          </div>
        </TabPanel>
        <TabPanel header="News"> </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Divider from 'primevue/divider';
import { getCountryInfo, getCurrenciesExcangeRate } from "../api.js";
import { onMounted, ref, computed } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { formatNumber } from "../utils.js";
import CurrencyExchager from "./CurrencyExchager.vue";

const isLodaing = ref(true);
const emits = defineEmits(["close"]);
const props = defineProps({
  country: {
    title: String,
    id: String,
  },
});

const countryData = ref(null);

const fromatedCountryData = computed(() => {
  let country =  {
      population: countryData.value.population || 'no data',
      capital: countryData.value.capital || 'no data',
      curency: countryData.value.curency || {name: 'no data', symbol: ''},
      gdp: countryData.value.gdp !== undefined ? `$${formatNumber(countryData.value.gdp)}` : 'no data',
      imports: countryData.value.imports != undefined ? `$${formatNumber(countryData.value.imports)}` : 'no data',
      exports: countryData.value.exports != undefined ? `$${formatNumber(countryData.value.exports)}` : 'no data',
      gdpPerCaptia: countryData.value.gdpPerCaptia !== undefined ? `$${countryData.value.gdpPerCaptia}` : 'no data'
  }
  return country;
});


onMounted(async () => {
  countryData.value = await getCountryInfo(props.country.id);
  const data = getCurrenciesExcangeRate();
  isLodaing.value = false;
});

function onClose() {
  emits("close");
}
</script>

<style scoped>
.country-wrapper {
  height: 700px;
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
  font-size: 16px;
}
.country-tab-content-field > label {
  font-weight: 400;
}
.panel-info{
  display: flex;
  flex-direction: column;
}
</style>
