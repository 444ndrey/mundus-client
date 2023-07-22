<template>
  <h2 v-if="isLoading">Loading...</h2>
  <div
    v-if="!isLoading"
    class="map-wrapper"
    ref="WRAPPER"
    @wheel="onWheel"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup.prevent="onMouseUp"
    @mouseout="onMosueOut"
  >
    <div class="map" ref="WRAPPER_MAP">
      <svg
        ref="map"
        class="map-svg"
        xmlns:mapsvg="http://mapsvg.com"
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:svg="http://www.w3.org/2000/svg"
        xmlns="http://www.w3.org/2000/svg"
        mapsvg:geoViewBox="-169.110266 83.600842 190.486279 -58.508473"
        width="1009.6727"
        height="665.96301"
      >
        <path
          class="map-country"
          v-for="country in countries"
          :class="{
            'selected-country': selectedCountry === country,
            'highlighted-country': props.highlightedCountries.has(country.id),
          }"
          :d="country.d"
          @mouseup="(e) => onMouseUp(e, country)"
        ></path>
      </svg>
    </div>
    <div class="move-panel">
      <Button
        icon="pi pi-plus"
        v-tooltip="'Zoom In'"
        text
        raised
        outlined
        rounded
        size="small"
        @click.stop="onPlus"
      />
      <Button
        icon="pi pi-refresh"
        v-tooltip="'Reset'"
        text
        raised
        outlined
        rounded
        size="small"
        @click.stop="onReset"
      />
      <Button
        icon="pi pi-minus"
        v-tooltip="'Zoom out'"
        text
        raised
        outlined
        rounded
        size="small"
        @click.stop="onMinus"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onBeforeMount } from "vue";
import Button from "primevue/button";
import { getCountries } from "../countries.js";
const isLoading = ref(true);
const countries = ref([]);
const WRAPPER = ref(null);
const WRAPPER_MAP = ref(null);
const map = ref(null);
onBeforeMount(async () => {
  countries.value = await getCountries();
  isLoading.value = false;
});

const props = defineProps({
  selectedCountry: Object,
  highlightedCountries: {
    type: Set,
    default: new Set()
  },
  isGameMode: Boolean
});

const emits = defineEmits(["country-select"]);

const options = {
  scale: 1.4,
  pointX: 0,
  pointY: 0,
  panning: false,
  startX: 0,
  startY: 0,
  isMoving: false,
  limit: 5,
};
function onMouseUp(e, country) {
  options.panning = false;
  if (!options.isMoving && country) {
    emits("country-select", country);
  }
}
function onMouseDown(e) {
  e.preventDefault();
  options.isMoving = false;
  if (!options.panning) {
    options.startX = e.clientX - options.pointX;
    options.startY = e.clientY - options.pointY;
    options.panning = true;
  }
}

function onMouseMove(e) {
  e.preventDefault();
  if (options.panning) {
    options.pointX = e.clientX - options.startX;
    options.pointY = e.clientY - options.startY;
    transform();
    options.isMoving = true;
  }
}

function onWheel(e) {
  e.preventDefault();
  const delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
  const xs = (e.clientX - options.pointX) / options.scale;
  const ys = (e.clientY - options.pointY) / options.scale;
  options.pointX = e.clientX - xs * options.scale;
  options.pointY = e.clientY - ys * options.scale;
  if (delta > 0) {
    if (options.scale >= 18) {
      return;
    }
    options.scale *= 1.2;
  } else {
    if (options.scale <= 1.4) {
      return;
    }
    options.scale /= 1.2;
  }
  transform();
}
function transform() {
  WRAPPER_MAP.value.style.transform = `translate(${options.pointX}px, ${options.pointY}px) scale(${options.scale})`;
}
function onReset() {
  options.pointX = 0;
  options.pointY = 0;
  options.scale = 1.4;
  transform();
}
function onPlus() {
  if (options.scale >= 14) {
    return;
  }
  options.scale *= 1.2;
  transform();
}
function onMinus() {
  if (options.scale <= 1.4) {
    return;
  }
  options.scale /= 1.2;
  transform();
}
function onMosueOut(){
  options.panning = false;
}
</script>

<style scoped>
.move-panel {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 15px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.map-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  flex: 1;
  margin: 0;
  overflow: hidden;
  /* cursor: move; */
  position: relative;
}
.map {
  padding: 20px;
  transform: scale(1.4);
}
.map-country {
  fill: #e5e5e5;
  stroke: #b2b2b2;
  stroke-width: 0.3;
  transition: 0.3s ease-in-out;
  cursor: pointer;
  position: relative;
}
.map-country:hover {
  fill: #759eff57;
  stroke: #759eff;
  stroke-width: 0.5;
}
.selected-country {
  fill: #759eff57 !important;
  stroke: #759eff !important;
}

.highlighted-country {
  fill: #75ffcc57 !important;
}
</style>
