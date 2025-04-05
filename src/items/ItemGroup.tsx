import { twMerge } from "tailwind-merge";
import { Block } from "../Block.jsx";
import { Item, TItemClassArg } from "./Item.js";
import { buildItemData, ItemData, ItemDef } from "./itemData.js";
import { Component, createMemo, For } from "solid-js";

type TProps = {
  items: ItemDef[];
  callback?: (id: string, item: ItemData) => void;
  class?: string | { group?: string; item?: TItemClassArg };
  selection?: string | { [id: string]: boolean };
};

export const ItemGroup: Component<TProps> = (props) => {
  const items = () => props.items.map(buildItemData);

  const classes = createMemo(() => {
    let group = "";
    let item: TItemClassArg = "";
    if (typeof props.class == "string") {
      group = props.class;
    } else if (props.class != undefined) {
      props.class;
      group = props.class.group ?? "";
      item = props.class.item ?? "";
    }

    return { group, item };
  });

  const blockClasses = () => {
    return twMerge("flex flex-row gap-1", classes().group);
  };

  const itemClasses = () => {
    return classes().item;
  };

  const callCallback = (item: ItemData) => {
    if (props.callback) {
      props.callback(item.id, item);
    }
  };

  const itemSelected = (id: string) => {
    if (typeof props.selection == "string") {
      return id == props.selection;
    } else if (typeof props.selection == "object") {
      return !!props.selection[id];
    }
    return false;
  };

  return (
    <Block class={blockClasses()}>
      <For each={items()}>
        {(item) => {
          return (
            <Item
              def={item}
              selected={itemSelected(item.id)}
              onClick={() => callCallback(item)}
              class={itemClasses()}
            ></Item>
          );
        }}
      </For>
    </Block>
  );
};
