<template>
  <div class="worldmap">
    <CountryInfo
      v-if="selectedCountry !== null"
      @close="onCountryInfoClose"
      class="panel-info"
      :country="selectedCountry"
    />
    <WorldMap @country-select="onCountrySelect" :selected-country="selectedCountry" />
  </div>
</template>

<script setup>
import {ref, nextTick} from 'vue';
import CountryInfo from "../components/CountryInfo.vue";
import WorldMap from "../components/WorldMap.vue";


const selectedCountry = ref(null);

async function onCountrySelect(country){
  selectedCountry.value = null;
    await nextTick(); // needs for waiting for the next DOM update.
    selectedCountry.value = country;
}

function onCountryInfoClose() {
  selectedCountry.value = null;
}
</script>

<style scoped>
.panel-info {
  position: absolute;
  left: 0;
  margin: 20px;
  background-color: #fff;
  z-index: 100;
}
.worldmap {
  position: relative;
  height: 100%;
}

</style>
