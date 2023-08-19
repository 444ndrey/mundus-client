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
    <Message
      v-else
      v-for="error in errors"
      severity="error"
      :closable="false"
      >{{ error.message }}</Message
    >
    <div class="country-info" v-if="!isLodaing && errors.length == 0">
      <div class="country-title">
        <img
          class="country-info-flag"
          :src="countryData.flag"
          :alt="countryData.altFlag"
        />
        <h2>{{ countryData.title }}</h2>
      </div>
      <TabView>
        <TabPanel header="Brief">
          <div class="country-tab">
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
            <p class="country-tab-content-field">
              <label>Languages: </label>{{ fromatedCountryData.languages }}
            </p>
            <p class="country-tab-content-field">
              <label>Start of The Week: </label>{{ fromatedCountryData.startOfTheWeek }}
            </p>
            <p class="country-tab-content-field">
              <label>Index Gini: </label>{{ fromatedCountryData.gini }}
            </p>
            <p class="country-tab-content-field">
              <label>Area: </label>{{ fromatedCountryData.area }}
            </p>
          </div>
        </TabPanel>
        <TabPanel header="Economic">
          <div class="country-tab panel-info">
            <CurrencyExchager :currencyCode="countryData.currencyCode" />
            <Divider />
            <p class="country-tab-content-field">
              <label>GDP: </label>{{ fromatedCountryData.gdp }}
            </p>
            <p class="country-tab-content-field">
              <label>GDP Per Captia: </label
              >{{ fromatedCountryData.gdpPerCaptia }}
            </p>
            <p class="country-tab-content-field">
              <label>Imports: </label>{{ fromatedCountryData.imports }}
            </p>
            <p class="country-tab-content-field">
              <label>Exports: </label>{{ fromatedCountryData.exports }}
            </p>
          </div>
        </TabPanel>
        <TabPanel header="News">
          <h3 style="width: 100%; text-align: center; margin-top: 20px ;">IN THE DEV</h3>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import Divider from "primevue/divider";
import { getCountryInfo } from "../api.js";
import { onMounted, ref, computed, nextTick } from "vue";
import ProgressSpinner from "primevue/progressspinner";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import { formatNumber } from "../utils.js";
import CurrencyExchager from "./CurrencyExchager.vue";
import Message from "primevue/message";

const isLodaing = ref(true);
const emits = defineEmits(["close"]);
const props = defineProps({
  country: {
    id: String,
  },
});

const countryData = ref(null);
const errors = ref([]);
onMounted(async () => {
  const data = await getCountryInfo(props.country.id);
  if (!data) {
    await setTimeout(() => {
      errors.value.push({ message: "Cannot get data from the server" });
      isLodaing.value = false;
    }, 5000);
    return;
  }
  countryData.value = data;
  isLodaing.value = false;
});



const fromatedCountryData = computed(() => {
  let country = {
    population: countryData.value.population || "no data",
    capital: countryData.value.capital || "no data",
    curency: countryData.value.curency || { name: "no data", symbol: "" },
    startOfTheWeek: countryData.value.startOfTheWeek || "no data",
    gini: countryData.value.gini || "no data",
    area: countryData.value.area !== undefined ? `${formatNumber(countryData.value.area)} km\u00B2` : "no data",
    
    languages: countryData.value.languages.join(', '),
    gdp:
      countryData.value.gdp != undefined
        ? `$${formatNumber(countryData.value.gdp)}`
        : "no data",
    imports:
      countryData.value.imports != undefined &&
      countryData.value.imports != null
        ? `$${formatNumber(countryData.value.imports)}`
        : "no data",
    exports:
      countryData.value.exports != undefined &&
      countryData.value.exports != null
        ? `$${formatNumber(countryData.value.exports)}`
        : "no data",
    gdpPerCaptia:
      countryData.value.gdpPerCaptia != undefined
        ? `$${countryData.value.gdpPerCaptia}`
        : "no data",
  };
  console.log(country)
  return country;
});
function onClose() {
  emits("close");
}
</script>

<style scoped>
.country-wrapper {
  height: 700px;
  width: 500px;
  background-color: var(--surface-50);
  border-radius: 10px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  -webkit-box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  -moz-box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  color: var(--color-text);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 20px;
}
.country-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.spinner {
  margin: auto;
}
.country-info {
  margin-top: 20px;
  overflow-y: auto;
}
.country-info-flag {
  max-width: 100px;
  max-height: 70px;
  border: 1px solid var(--surface-300);
}
.country-title {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  gap: 15px;
  align-items: center;
}
.country-title > h2 {
  align-self: flex-end;
  color: var(--surface-800);
}
.country-tab-content-field {
  margin-bottom: 20px;
  font-weight: 500;
  font-size: 16px;
}
.country-tab-content-field > label {
  font-weight: 400;
}
.panel-info {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* MEDIA QUERIES */

@media (max-width: 1000px) {
  .country-wrapper {
    width: 450px;
    height: 650px;
  }
}

@media (max-width: 1024px) {
  .country-wrapper {
    width: 400px;
    height: 600px;
    margin-left: 10px;
  }
  .country-tab-content-field {
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 14px;
  }
  .country-info-flag{
    max-width: 80px;
    max-height: 50px;
  }
}
@media (max-width: 680px) {
  .country-wrapper {
    border-radius: 10px;
    margin-top: 40px;
  }
}
@media (max-width: 450px) {
  .country-wrapper {
    width: 350px;
    min-height: 500px;
  }
  .country-tab-content-field {
    margin-bottom: 10px;
    font-size: 12px;
  }
  .p-tabview{
    font-size: 12px;
  }
  .country-title > h2{
    font-size: 16px
  }
}
@media (max-width: 360px) {
  .country-wrapper {
    width: 300px;
  }
  .country-tab-content-field {
    font-weight: 500;
    font-size: 12px;
  }
  .p-tabview{
    font-size: 12px;
  }
  .country-title > h2{
    font-size: 16px
  }
}
</style>
