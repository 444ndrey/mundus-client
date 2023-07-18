<template>
  <ProgressSpinner v-if="isLodaing" />
  <div>
  <h3 v-if="isNoData">No currency data</h3>
  <div class="exchanger-wrapper" v-if="!isLodaing && !isNoData">
    <div class="exchanger-top">
      <Dropdown
        class="exchanger-dropdown w-full md:w-14rem"
        v-model="selectedFromCurrency"
        optionLabel="name"
        filter
        :options="options"
        placeholder="Select currency"
        @change="onChangeCurrency"
      ></Dropdown>
      <Button
        icon="pi pi-arrow-right-arrow-left"
        @click="onSwitch"
        text
        raised
        rounded
        aria-label="Filter"
      ></Button>
      <Dropdown
        class="exchanger-dropdown"
        v-model="selectedToCurrency"
        optionLabel="name"
        filter
        :options="options"
        placeholder="Select currency"
        @change="onChangeCurrency"
      ></Dropdown>
    </div>
    <div class="exchanger-bottom">
      <InputNumber
        v-model="fromCurrencyValue"
        :min="0"
        :max="1000000000"
        mode="currency"
        :currency="selectedFromCurrency.code"
      ></InputNumber>
      <h2 class="exchanger-result">
        {{ selectedToCurrency.symbol }} {{ convertedValue }}
      </h2>
    </div>
  </div>
</div>
</template>

<script setup>
import Dropdown from "primevue/dropdown";
import { getAllCurrencies, getCurrenciesExcangeRate } from "../api.js";
import { computed, onMounted, ref } from "vue";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import ProgressSpinner from 'primevue/progressspinner';

const options = ref([]);
const selectedFromCurrency = ref(null);
const selectedToCurrency = ref(null);
const props = defineProps(["currencyCode"]);
const fromCurrencyValue = ref(1);
const isLodaing = ref(true);
const currencyRate = ref(1);
let isNoData = ref(false);
const convertedValue = computed(() => {
  if(!fromCurrencyValue.value){
    fromCurrencyValue.value = 1;
  }
   let value = parseFloat( (currencyRate.value * fromCurrencyValue.value).toFixed(3) );
   return new Intl.NumberFormat('ru', {minimumFractionDigits: 1}).format(value);
});

onMounted(async () => {
  options.value = await getAllCurrencies();
  selectedToCurrency.value = options.value.find(
    (c) => c.code == props.currencyCode
  );
  if(!selectedToCurrency.value){
    isNoData.value = true;
    isLodaing.value = false;
    return;
  } 
  selectedFromCurrency.value = options.value.find((c) => c.code === "USD");

  selectedToCurrency.value = options.value.find(
    (c) => c.code == props.currencyCode
  );
  currencyRate.value = await getCurrenciesExcangeRate(
    "USD",
    props.currencyCode
  );
  isLodaing.value = false;
});
async function onSwitch() {
  let temp = selectedFromCurrency.value;
  selectedFromCurrency.value = selectedToCurrency.value;
  selectedToCurrency.value = temp;
  currencyRate.value = await getCurrenciesExcangeRate(
    selectedFromCurrency.value.code,
    selectedToCurrency.value.code
  );
}
async function onChangeCurrency(e){
  currencyRate.value = await getCurrenciesExcangeRate(
    selectedFromCurrency.value.code,
    selectedToCurrency.value.code
  );
}
</script>

<style scoped>
.exchanger-top {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
.exchanger-dropdown {
  width: 200px;
  font-size: 10px;
}
.exchanger-bottom {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}
</style>
