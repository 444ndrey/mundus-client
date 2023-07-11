<template>
  <div class="worldmap">
    <CountryInfo
      v-if="selectedCountry !== null"
      @close="onCountryInfoClose"
      class="panel-info"
      :country="selectedCountry"
    />
    <div
      class="map-wrapper"
      ref="WRAPPER"
      @wheel="onWheel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
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
          <path class="map-country" :class="{'selected-country' : selectedCountry === country}" v-for="country in countries" :d="country.d" @mouseup="e => onMouseUp(e, country)"></path>
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
  </div>
</template>
<script setup>
import CountryInfo from "./CountryInfo.vue";
import { onMounted, ref, onBeforeMount } from "vue";
import Button from "primevue/button";
import { getCountriesAsync } from "../countries.js";

const WRAPPER = ref(null);
const WRAPPER_MAP = ref(null);
const map = ref(null);
const selectedCountry = ref(null);
const countries = ref([]);

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

onBeforeMount(async () => {
  countries.value = await getCountriesAsync();
});

function onMouseUp(e, country) {
  options.panning = false;
  if (!options.isMoving && country) {
    selectedCountry.value = country
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

function onMouseMove(e){
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
    if (options.scale >= 14) {
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
function onMouseOut(){
  options.panning = false
}

function onReset() {
  options.pointX = 0;
    options.pointY = 0;
    options.scale = 1.4;
    transform();
}
function onPlus() {
  if(options.scale >= 14){
        return;
    }
    options.scale *= 1.2;   
    transform();
}
function onMinus() {
  if(options.scale <= 1.4){
        return
    }
    options.scale /= 1.2;
    transform();
}
function onClick(country) {
  if (country.title) {
    if (selectedCountry.value) {
      selectedCountry.value.htmlTarget.classList.remove("selected-country");
    }
    selectedCountry.value = country;
    selectedCountry.value.htmlTarget.classList.add("selected-country");
  }
}
function onCountryInfoClose() {
  selectedCountry.value = null;
}
</script>

<style scoped>
.worldmap {
  position: relative;
  height: 100%;
}
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
  cursor: grab;
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
.panel-info {
  position: absolute;
  left: 0;
  margin: 20px;
  background-color: #fff;
  z-index: 100;
}
.selected-country {
  fill: #759eff57 !important;
  stroke: #759eff !important;
}
</style>
