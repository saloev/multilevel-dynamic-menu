<template>
  <div id="app">
      <MenuItem :item="{link: '/', text: 'test1'}" is-active />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MenuItem from "@/components/MenuItem.vue";

@Component({
  components: {
    MenuItem,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  padding: 1vw;

  min-height: 100vh;
  width: 100%;

  background: url($assets + '/images/main-bg.jpg') center/cover;
}
</style>
