<script lang="ts">
/* eslint-disable */
import { VNode, CreateElement } from "vue";
import { Vue, Prop, Component } from "vue-property-decorator";

import MenuLinkItem from "./MenuLink.vue";
import { MenuItem } from "@/types";

interface MenuItemType extends MenuItem {
  show?: boolean;
  level?: string;
}

const renderMenu = (h: CreateElement, list: Array<MenuItemType>): VNode => {
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
                text: `${item.text} ${item.level}`
              }
            },
            class: {
              "menu-list__link": true
            },
            attrs: {
              "data-id": item.level
            }
          }),
          ...[item.subMenu && item.subMenu.length ? renderMenu(h, item.subMenu) : []]
        ]
      )
    )
  );
};

@Component({})
export default class Menu extends Vue {
  @Prop({ type: Array, required: true }) list!: Array<MenuItem>;
  //https://github.com/vuejs/vue/issues/2410#issuecomment-318487855 :(
  setChangeTracker: number =  1; // :(
  currentClicedLinksId: Set<string> = new Set();

  mounted() {}

  get normalizedList(): Array<MenuItemType> {
    //TODO make deep copy
    const copy = [...this.list];

    const iter = (items: Array<MenuItemType>, level: string): Array<MenuItemType> => {
      return items.map((item: MenuItemType, index: number) => {
        const newlevel = `${level ? level + "." : ""}${index + 1}`;
        item.show = this.currentClicedLinksId.has(newlevel);
        item.level = newlevel;
        if (item.subMenu) item.subMenu = iter(item.subMenu, newlevel);
        return item;
      });
    };
    
    if (this.setChangeTracker)
      return  iter(copy, "");
    
    return copy;
  }

  onSpaceClick(id: string) {
    const isSubTree = () => {
      const discardLastItem = id.split('.').slice(0, -1).join('.');
      const subIds = discardLastItem === '.' ? id : discardLastItem;

      return this.currentClicedLinksId.has(subIds);
    }

    if (!isSubTree()) this.onBackquoteClick();

    this.currentClicedLinksId.add(id);
    this.setChangeTracker += 1;
  }

  onBackspaceClikc() {
    function getLastValue(set: Set<string>): string | undefined {
      let value;
      for (value of set);
      return value;
    }

    const lastVal = getLastValue(this.currentClicedLinksId);
    if (lastVal) {
      this.setChangeTracker -= 1;
      this.currentClicedLinksId.delete(lastVal);
    }
  }

  onBackquoteClick() {
    this.currentClicedLinksId = new Set();
    this.setChangeTracker = 1;
  }

  public render(h: CreateElement): VNode {
    return h(
      "div",
      {
        class: {
          menu: true
        },
        on: {
          keyup: ({ code, target }: KeyboardEvent) => {
            if (!target) return;
            //@ts-ignore
            const id = target.dataset && target.dataset.id;
            if (!id) return;

            const dispathByCode: {
              [key: string]: VoidFunction;
            } = {
              Space: () => this.onSpaceClick(id),
              Backspace: () => this.onBackspaceClikc(),
              Backquote: () => this.onBackquoteClick()
            };

            if (typeof  dispathByCode[code] !== 'undefined') dispathByCode[code]();
          }
        }
      },
      [renderMenu(h, this.normalizedList)]
    );
  }
}
</script>
<style lang="scss">
@mixin hide() {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
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
