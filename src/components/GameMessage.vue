<template>
  <div class="message-wrapper">
    <h2>Find Country</h2>
    <h3 class="message-content">{{content}}</h3>
  </div>
</template>

<script setup>
//states = find, succes, fail
import { ref, computed } from "vue";

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
        return `Find ${props.countryName}`
    }
    case "succes": {
        return `Correct!`
    }
    case "fail": {
        return `Failed!`
    }
  }
});
</script>

<style scoped>
.message-wrapper {
  width: 700px;
  height: 100px;
  background-color: #fff;
  z-index: 100;
  border-radius: 5px;
  -webkit-box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  -moz-box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  box-shadow: 3px 10px 30px 11px rgba(110, 99, 174, 0.2);
  padding: 10px;
}
.message-wrapper > h2{
    margin-bottom: 10px;

}
.message-content {
  width: 100;
  font-weight: 300;
}
.message-content_find{
    color: var(--base-font-color-light);
}
.message-content_succes{
    color: #abd268;
}
.message-content_fail{
    color: #da6860;
}
</style>
