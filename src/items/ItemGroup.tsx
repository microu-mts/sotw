import { twMerge } from "tailwind-merge";
import { Block } from "../Block.jsx";
import { Item, TItemClassArg } from "./Item.js";
import { buildIdLabel, IdLabel, IdLabelArg } from "./IdLabel.js";
import { Component, createMemo, For } from "solid-js";
import { TagListArgument } from "../stylers/types.js";
import { normalizeTagListArgument } from "../stylers/tagRules.js";

type TProps = {
  items: IdLabelArg[];
  callback?: (id: string, item: IdLabel) => void;
  class?: string | { group?: string; item?: TItemClassArg };
  selection?: string | { [id: string]: boolean };
  vtags?: TagListArgument | { group?: TagListArgument; item?: TagListArgument };
};

export const ItemGroup: Component<TProps> = (props) => {
  const items = () => props.items.map(buildIdLabel);

  const currentVTags = createMemo<{ group: string[]; item?: string[] }>(() => {
    const item = [] as string[];
    const group = [] as string[];
    const _vtags = props.vtags;
    if (Array.isArray(_vtags) || typeof _vtags == "string") {
      group.push(...normalizeTagListArgument(_vtags));
    } else if (typeof _vtags == "object") {
      group.push(...normalizeTagListArgument(_vtags.group));
      item.push(...normalizeTagListArgument(_vtags.item));
    }
    return { group, item };
  });

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

  const callCallback = (item: IdLabel) => {
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
    <Block class={blockClasses()} vtags={currentVTags().group}>
      <For each={items()}>
        {(item) => {
          return (
            <Item
              def={item}
              selected={itemSelected(item.id)}
              onClick={() => callCallback(item)}
              class={itemClasses()}
              vtags={currentVTags().item}
            ></Item>
          );
        }}
      </For>
    </Block>
  );
};
