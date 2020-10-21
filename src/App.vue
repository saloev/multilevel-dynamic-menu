<template>
  <div id="app">
    <Menu :list="menuList" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Menu from "@/components/Menu.vue";

import menuData from "@/data/menu.json";

import { MenuItem } from "@/types";

@Component({
  components: {
    Menu,
  },
})
export default class App extends Vue {
  menuList: Array<MenuItem> = menuData;
}
</script>

<style lang="scss">
#app {
  padding: 1vw;

  min-height: 100vh;
  width: 100%;

  background: url($assets+"/images/main-bg.jpg") center/cover;
}
</style>
