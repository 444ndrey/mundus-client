<template>
  <Dialog
    class="dialog"
    :visible="props.visable"
    @update:visible="() => emits('close')"
    modal
    header="Game Over"
    :style="{ width: '40vw' }"
  >
    <p class="dialog-font">Your score: {{ props.gameScore }}</p>
    <!-- <p class="dialog-font">Best: {{ bestResult }}</p> -->
    <template #footer>
      <Button class="dialog-btn" text rounded @click="() => emits('close')"
        >OK</Button
      >
    </template>
  </Dialog>
</template>

<script setup>
//TODO: ADD FOUND COUNTRY LIST RESULT;
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { getGameBestResult } from "../cache_storage.js";

const bestResult = getGameBestResult();
const props = defineProps({
  visable: {
    type: Boolean,
    default: false,
  },
  gameScore: Number,
  countries: Set,
});

const emits = defineEmits(["close"]);
</script>

<style scoped>
.dialog-country_list {
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
  width: 100%;
}
.dialog-font {
  font-size: 18px;
}

@media (max-width: 800px) {
  .dialog-font {
    font-size: 14px;
  }
  .dialog{
    width: 400px;
  }
}
</style>
