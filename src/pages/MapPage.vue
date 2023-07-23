<template>
  <GameDialogResult v-model:visable="isDialog"
   @close="isDialog=false"
   :game-score="gameScore"
   :countries="gameFoundCountries"
    />
  <div class="worldmap">
    <GameMessage
      class="game-message"
      :state="gameState"
      :country-name="countryToFind.title || ''"
      v-if="isGameMode"
    />
    <CountryInfo
      v-if="isCountryInfoShown"
      @close="onCountryInfoClose"
      class="panel-info"
      :country="selectedCountry"
    />
    <Button
      class="play-btn"
      :icon="isGameMode ? 'pi pi-times' : 'pi pi-play'"
      v-tooltip="isGameMode ? 'End the game' : 'Play the game'"
      rounded
      outlined
      size="small"
      @click.stop="onStartTheGame"
    >
    </Button>
    <WorldMap
      @country-select="onCountrySelect"
      :selected-country="selectedCountry"
      :highlighted-countries="gameFoundCountries"
      :is-country-name-tool-tip-shown="!isGameMode"
    />
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import CountryInfo from "../components/CountryInfo.vue";
import WorldMap from "../components/WorldMap.vue";
import Button from "primevue/button";
import { getCountries } from "../countries.js";
import GameMessage from "../components/GameMessage.vue";
import GameDialogResult from '../components/GameDilaogResult.vue';
import {storeGameBestResult} from '../cache_storage.js'


const selectedCountry = ref(null);
const isCountryInfoShown = ref(false);
const isGameMode = ref();
let gameCountriesList = null;
const countryToFind = ref(null);
const gameFoundCountries = ref(new Set());
//states = find, succes, fail
const gameState = ref("find");
const isDialog = ref(false);
let gameScore = 0;


async function onCountrySelect(country) {
  if (isGameMode.value) {
    gameCountrySelect(country);
    return;
  }
  isCountryInfoShown.value = false;
  await nextTick(); // needs for waiting for the next DOM update.
  isCountryInfoShown.value = true;
  selectedCountry.value = country;
}

function onCountryInfoClose() {
  isCountryInfoShown.value = false;
}

async function onStartTheGame() {
  if (isGameMode.value) {
    isGameMode.value = false;
    gameFoundCountries.value = new Set();
  } else {
    gameScore = 0;
    isGameMode.value = true;
    isCountryInfoShown.value = false;
    selectedCountry.value = null;
    gameCountriesList = (await getCountries()).map((c) => {
      return {
        id: c.id,
        title: c.title,
      };
    });
    setRandomCountry();
  }
}

function setRandomCountry() {
  const randomIndex = Math.floor(Math.random() * gameCountriesList.length);
  countryToFind.value = gameCountriesList[randomIndex];
  gameCountriesList.splice(randomIndex, 1);
}
function gameCountrySelect(country) {
  if (gameFoundCountries.value.has(country.id) || gameState.value !== "find") {
    return;
  }
  if (countryToFind.value.id == country.id) {
    gameState.value = "succes";
    gameScore += 1;
    gameFoundCountries.value.add(country.id);
    setTimeout(() => {
      gameState.value = "find";
      setRandomCountry();
    }, 2000);
    return;
  }
  gameState.value = "fail";
  storeGameBestResult(gameScore);
  setTimeout(() => {
    gameState.value = "find";
    isGameMode.value = false;
    isDialog.value = true;
    gameFoundCountries.value = new Set();
  }, 1000);
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
.play-btn {
  position: absolute;
  left: 0;
  z-index: 10;
  margin: 15px;
  bottom: 0;
}
.game-message {
  position: absolute;
  top: 0;
  margin-left: 20px;
  z-index: 100;
  margin-top: 10px;
}
</style>
