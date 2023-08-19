<template>
  <div class="scale" v-tooltip="selectedType">
    <div
      class="scale-option"
      :style="{ 'background-color': getColorOfCountry(item, selectedType) }"
      v-for="(item, key, index) in heats[props.selectedType]"
    >
      <p>{{ ">" }} {{ formatNumber(item) }}</p>
    </div>
    <div
      class="scale-option"
      :style="{
        'background-color': getColorOfCountry(
          heats[props.selectedType].VERY_COLD - 1,
          selectedType
        ),
      }"
    >
      <p>{{ "<" }} {{ formatNumber(heats[props.selectedType].VERY_COLD) }}</p>
    </div>
  </div>
</template>

<script setup>
import heats from "../heats";
import { formatNumber, getColorOfCountry } from "../utils";

const props = defineProps({
  selectedType: {
    type: String,
    default: "population",
  },
});
</script>

<style scoped>
.scale {
  height: 30px;
  margin: 15px;
  border: 1px solid transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}
.scale-option {
  flex: 1;
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  width: 100px;
  padding: 5px;
}
.scale > .scale-option:last-child {
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
.scale > .scale-option:first-child {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.scale-option > p {
  font-size: 10px;
  align-items: center;
  align-self: center;
  text-align: center;
  font-weight: 700;
  color: #292828;
}

@media (max-width: 700px) {
  .scale-option > p {
    font-size: 8px;
  }
  .scale-option {
    width: 70px;
  }
}
</style>
