<script lang="ts">
/* eslint-disable */
import { VNode, CreateElement } from "vue";
import { Vue, Prop, Component } from "vue-property-decorator";

import MenuLinkItem from "./MenuItem.vue";
import { MenuItem } from "@/types";

const renderMenu = (h: CreateElement, list: Array<MenuItem>, level: string): VNode => {
  return h(
    "ul",
    {
      class: {
        menu__list: true,
        "menu-list": true
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
                text: `${item.text} ${level ? level + '.': ''}${index + 1}`
              }
            },
            class: {
              "menu-list__link": true
            }
          }),
          ...[item.subMenu && item.subMenu.length ?  renderMenu(h, item.subMenu, `${level ? level + '.': ''}${index + 1}` ): []]
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
      [renderMenu(h, this.list, '')]
    );
  }
}
</script>
<style lang="scss"></style>
