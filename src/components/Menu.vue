<script lang="ts">
/* eslint-disable */
import { VNode, CreateElement } from "vue";
import { Vue, Prop, Component } from "vue-property-decorator";

import MenuLinkItem from "./MenuLink.vue";
import { MenuItem } from "@/types";

const renderMenu = (h: CreateElement, list: Array<MenuItem>, level: string): VNode => {
  return h(
    "ul",
    {
      class: {
        menu__list: true,
        "menu-list": true,
        "reset--list-style": true
      }
    },
    list.map((item: MenuItem, index: number) =>
      h(
        "li",
        {
          class: {
            "menu-list__item": true
          }
        },
        [
          h(MenuLinkItem, {
            props: {
              item: {
                ...item,
                text: `${item.text} ${level ? level + "." : ""}${index + 1}`
              }
            },
            class: {
              "menu-list__link": true
            }
          }),
          ...[
            item.subMenu && item.subMenu.length
              ? renderMenu(h, item.subMenu, `${level ? level + "." : ""}${index + 1}`)
              : []
          ]
        ]
      )
    )
  );
};

@Component({})
export default class Menu extends Vue {
  @Prop({ type: Array, required: true }) list!: Array<MenuItem>;

  public render(h: CreateElement): VNode {
    return h(
      "div",
      {
        class: {
          menu: true
        }
      },
      [renderMenu(h, this.list, "")]
    );
  }
}
</script>
<style lang="scss">
@mixin hide() {
  opacity: 0;
  visibility: hidden;
}

@mixin show() {
  opacity: 1;
  visibility: visible;
  pointer-events: all;
}

.menu {
  display: grid;
  align-content: center;
  height: 100%;
  grid-template-columns: max-content;
}

.menu-list {
  --col-space: 1vw;
  --row-space: 0.2vw;
  position: relative;

  display: grid;
  grid-gap: var(--row-space);

  &__item {
    z-index: 10;

    .menu-list {
      position: absolute;
      left: calc(100% + var(--col-space));
      top: 0;

      width: fit-content;

      @include hide();

      transition: all 0.3s linear;
    }

      /**
        * before element need to fill empty space when mouse move
        */
      &::before {
        content: none;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 2;

        height: 100%;
        width: calc(100%);
        transform: translateX(100%);
      }

    &:hover > .menu-list {
      @include show();
    }

    &:hover::before {
      content: "";

      @include show();
    }
  }

  &.show {
    @include show();
  }

  &__link {
    position: relative;
    z-index: 5;
  }
}
</style>
