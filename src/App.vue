<template>
  <div id="app">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  width: 100%;

  background: url($assets + '/images/main-bg.jpg') center/cover;
}
</style>
