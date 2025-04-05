import { twMerge } from "tailwind-merge";
import { Block } from "./Block.js";
import { Item, TItemClass } from "./Item.js";
import { buildItemData, ItemData, ItemDef } from "./itemData.js";
import { Component, createMemo, For } from "solid-js";

type TProps = {
  items: ItemDef[];
  callback?: (id: string, item: ItemData) => void;
  class?: string | { group?: string; item?: TItemClass };
  selection?: string | { [id: string]: boolean };
};

export const ItemGroup: Component<TProps> = (props) => {
  const items = () => props.items.map(buildItemData);

  const classes = createMemo(() => {
    let group = "";
    let item: TItemClass = "";
    if (typeof props.class == "string") {
      group = props.class;
    } else if (props.class != undefined) {
      props.class;
      group = props.class.group ?? "";
      item = props.class.item ?? "";
    }

    return { group, item};
  });

  const blockClasses = () => {
    return twMerge("flex flex-row gap-1", classes().group);
  };

  const itemClasses = () => {
    return classes().item;
  };

  // const itemSelectedClasses = () => {
  //   const iclasses = classes().item 
  //   if (typeof  iclasses == "string") {
  //     return ""
  //   } else {
  //     return iclasses.selected ?? ""
  //   }
  // };

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
