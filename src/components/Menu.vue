<script lang="ts">
/* eslint-disable */
import { VNode, CreateElement } from "vue";
import { Vue, Prop, Component } from "vue-property-decorator";

import MenuLinkItem from "./MenuLink.vue";
import { MenuItem } from "@/types";

interface MenuItemType extends MenuItem {
  show?: boolean;
}

const renderMenu = (h: CreateElement, list: Array<MenuItemType>, level: string): VNode => {
  return h(
    "ul",
    {
      class: {
        menu__list: true,
        "menu-list": true,
        "reset--list-style": true
      }
    },
    list.map((item: MenuItemType, index: number) =>
      h(
        "li",
        {
          class: {
            "menu-list__item": true,
            show: item.show
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
  normalizedList: Array<MenuItemType> = [];

  mounted() {
    this.addShowPropToList();
  }

  addShowPropToList() {
    const copy = [...this.list];
    const iter = (items: Array<MenuItemType>): Array<MenuItemType> => {
      return items.map((item: MenuItemType) => {
        item.show = false;
        if (item.subMenu) item.subMenu = iter(item.subMenu);
        return item;
      });
    };
    this.normalizedList = iter(copy);
  }

  onSpaceClick(): VoidFunction | undefined {
    const elem: Element | null = document.activeElement;
    const isMenuLink = elem && elem.classList.contains("menu-list__link");
    if (!isMenuLink) return;

    const li: Element | null = document.parentElement;
    if (!li) return;
  }

  onBackspaceClikc(): VoidFunction | undefined {
    return;
  }

  onEnterClick(): VoidFunction | undefined {
    return;
  }

  public render(h: CreateElement): VNode {
    return h(
      "div",
      {
        class: {
          menu: true
        },
        on: {
          keyup: ({ code }: KeyboardEvent) => {
            const dispathByCode: {
              [key: string]: VoidFunction | undefined;
            } = {
              Space: this.onSpaceClick(),
              Backspace: this.onBackspaceClikc(),
              Enter: this.onEnterClick()
            };

            dispathByCode[code];
          }
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

    &:hover > .menu-list,
    &.show > .menu-list {
      @include show();
    }

    &:hover::before,
    &.show::before {
      content: "";

      @include show();
    }
  }

  &__link {
    position: relative;
    z-index: 5;
  }
}
</style>
