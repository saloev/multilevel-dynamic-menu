<template>
  <a :class="classes" :href="item.link" @click="onClick(item)">
    <span class="menu-item__text">
      <span class="menu-item__inner-text">{{ item.text }}</span>
    </span>
  </a>
</template>
<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

import { MenuItem } from "@/types";

@Component({})
export default class MenuItemLink extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  item!: MenuItem;

  @Prop({
    type: Boolean,
    default: false,
  })
  isActive!: boolean;

  get classes() {
    return {
      "menu-item": true,
      "menu-item--active": this.isActive,
    };
  }

  onClick(item: MenuItem) {
    console.log("LINK ACTION", item.action);
    if (item.action) this.$emit(item.action, item);
  }
}
</script>
<style lang="scss">

.menu-item {
  --space: 0.2vw;
  --font-size: 10vw;

  @include media('sm-and-up') {
    --font-size: 5vw;
  }

  @include media('lg-and-up') {
    --font-size: 2vw;
  }

  min-width: max-content;
  display: block;
  padding: var(--space);
  border: var(--space) solid $info;
  outline-width: var(--space);
  outline-color: transparent;
  outline-style: dashed;

  font-size: var(--font-size);
  line-height: 1.2;
  color: $white;
  text-decoration: none;
  text-transform: uppercase;

  transition: border-color 0.2s linear, color 0.2s linear, outline-color 0.2s linear;

  &--active {
    background: transparentize($black, 0.7);
    color: $primary;
  }

  &:hover,
  &:focus {
    border-color: $white;
    color: $black;

    .menu-item__text::before {
      opacity: 1;
    }
  }

  &:focus {
    outline-color: $primary;
  }

  &__text {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: calc(var(--space) + 1vw);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      background: linear-gradient(90deg, $secondary, $primary 5%);
      opacity: 0;

      @include transition();
    }
  }

  &__inner-text {
    position: relative;
    z-index: 2;
  }
}
</style>
