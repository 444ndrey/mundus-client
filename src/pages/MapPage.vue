<template>
  <GameDialogResult
    v-model:visable="isDialog"
    @close="isDialog = false"
    :game-score="gameScore"
    :countries="gameFoundCountries"
  />
  <div class="worldmap">
    <Transition name="info-slide-fade">
      <GameMessage
        class="game-message"
        :state="gameState"
        :country-name="countryToFind.title || ''"
        v-if="isGameMode"
      />
    </Transition>
    <Transition name="info-slide-fade">
      <CountryInfo
        v-if="isCountryInfoShown && selectedCountry"
        @close="onCountryInfoClose"
        class="panel-info"
        :country="selectedCountry"
      />
    </Transition>
    <div class="btns-menu">
      <Button
        icon="pi pi-list"
        v-tooltip="'To the list'"
        rounded
        outlined
        size="small"
        @click.stop="() => router.push('/list')"
      />
      <Button
        :icon="isGameMode ? 'pi pi-times' : 'pi pi-play'"
        v-tooltip="isGameMode ? 'End the game' : 'Play the game'"
        rounded
        outlined
        size="small"
        @click.stop="onStartTheGame"
      />
    </div>
    <WorldMap
      @country-select="onCountrySelect"
      :selected-country="selectedCountry"
      :highlighted-countries="gameFoundCountries"
      :is-country-name-tool-tip-shown="!isGameMode"
    />
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from "vue";
import CountryInfo from "../components/CountryInfo.vue";
import WorldMap from "../components/WorldMap.vue";
import Button from "primevue/button";
import { getFiltredCountriesForGame } from "../countries.js";
import GameMessage from "../components/GameMessage.vue";
import GameDialogResult from "../components/GameDilaogResult.vue";
import { storeGameBestResult } from "../cache_storage.js";
import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const router = useRouter();
const isCountryInfoShown = ref(false);
const isGameMode = ref();
let gameCountriesList = null;
const countryToFind = ref({ title: "" });
const gameFoundCountries = ref(new Set());
//states = find, succes, fail
const gameState = ref("find");
const isDialog = ref(false);
let gameScore = 0;

onMounted(async () => {
  if (route.query.countryId) {
    selectedCountry.value = { id: route.query.countryId };
    isCountryInfoShown.value = true;
  }
});
const selectedCountry = ref(null);

watch(selectedCountry, () => {
  if (selectedCountry.value === null) {
    router.push({ query: {} });
    return;
  }
  router.push({ query: { countryId: selectedCountry.value.id } });
});

async function onCountrySelect(country) {
  if (isGameMode.value) {
    gameCountrySelect(country);
    return;
  }
  isCountryInfoShown.value = false;
  selectedCountry.value = country;
  await nextTick(); // needs for waiting for the next DOM update.
  isCountryInfoShown.value = true;
}

function onCountryInfoClose() {
  isCountryInfoShown.value = false;
  selectedCountry.value = null;
}

async function onStartTheGame() {
  isCountryInfoShown.value = false;
  await nextTick();
  selectedCountry.value = null;
  if (isGameMode.value) {
    isGameMode.value = false;
    gameFoundCountries.value = new Set();
  } else {
    gameScore = 0;
    isGameMode.value = true;
    gameCountriesList = (await getFiltredCountriesForGame()).map((c) => {
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
  z-index: 100;
}
.worldmap {
  position: relative;
  height: 100%;
}

.btns-menu{
  position: absolute;
  left: 0;
  z-index: 10;
  margin: 15px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.game-message {
  position: absolute;
  top: 0;
  margin-left: 20px;
  z-index: 100;
  margin-top: 10px;
}
.info-slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.info-slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.info-slide-fade-enter-from,
.info-slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
/*Media queries */

@media (max-width: 700px) {
  .panel-info {
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
  }
}
</style>
