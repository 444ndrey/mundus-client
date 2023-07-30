<template>
  <div
    class="message-wrapper"
    :class="{
      'message-wrapper_succes': props.state === 'succes',
      'message-wrapper_fail': props.state === 'fail',
    }"
  >
    <h2>Find Country</h2>
    <h3 class="message-content">{{ content }}</h3>
  </div>
</template>

<script setup>
//states = find, succes, fail
import { computed } from "vue";

const props = defineProps({
  countryName: String,
  state: {
    type: String,
    state: "find",
  },
});

const content = computed(() => {
  switch (props.state) {
    case "find": {
      return `Find ${props.countryName}`;
    }
    case "succes": {
      return `Correct!`;
    }
    case "fail": {
      return `Failed!`;
    }
  }
});
</script>

<style scoped>

.message-wrapper {
  min-width: 400px;
  max-width: 700px;
  background-color: var(--bg-color);
  filter: opacity(0.7);
  z-index: 100;
  border-radius: 5px;
  -webkit-box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  -moz-box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  padding: 10px;
  border: 2px solid transparent;
}
.message-wrapper > h2 {
  margin-bottom: 10px;
}
.message-content {
  width: 100;
  font-weight: 400;
  font-size: 18px;
}
.message-wrapper > .message-content {
  color: var(--color-text);
}

.message-wrapper_succes {
  border-color: var(--message-succes-color);
}
.message-wrapper_fail {
  border-color: var(--message-fail-color);
}
.message-wrapper_succes > .message-content {
  color: var(--message-succes-color);
}
.message-wrapper_fail > .message-content {
  color: var(--message-fail-color);
}

@media (max-width: 480px) {
  .message-content {
    width: 100;
    font-weight: 400;
    font-size: 16px;
  }
  .message-wrapper > h2 {
    margin-bottom: 10px;
    font-size: 18px;
  }
  .message-wrapper{
    min-width: 300px;
  }
}
</style>
